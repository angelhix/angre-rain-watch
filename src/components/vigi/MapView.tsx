import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Polygon, Circle, CircleMarker, Polyline, Popup, Tooltip, useMap, useMapEvents, Marker } from "react-leaflet";
import {
  ANGRE_CENTER,
  sectors,
  exposureZones,
  reports,
  alerts,
  affectedRoads,
  reportTypeLabels,
  waterHeightLabels,
  alertLevelLabels,
  fmtDateTime,
  type LatLng,
  type ReportType,
} from "@/lib/mock-data";

export type MapLayers = {
  sectors?: boolean;
  exposure?: boolean;
  reports?: boolean;
  alerts?: boolean;
  roads?: boolean;
};

const cssVar = (name: string) =>
  typeof window === "undefined" ? "#888" : getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#888";

const levelVar = { vigilance: "--level-vigilance", locale: "--level-locale", urgente: "--level-urgente" } as const;
const typeVar: Record<ReportType, string> = {
  route_inondee: "--primary",
  habitation: "--level-urgente",
  caniveau_bouche: "--level-locale",
  vehicule: "--exercise",
  autre: "--muted-foreground",
};

const pinIcon = L.divIcon({
  className: "",
  html: '<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:var(--level-urgente);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

function PickHandler({ onPick }: { onPick: (p: LatLng) => void }) {
  useMapEvents({ click: (e) => onPick([e.latlng.lat, e.latlng.lng]) });
  return null;
}

function Recenter({ center }: { center?: LatLng }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapView({
  layers = { sectors: true, exposure: true, reports: true, alerts: true, roads: true },
  reportTypes,
  sectorFilter,
  height = "100%",
  pick,
  onPick,
  zoom = 15,
  center,
}: {
  layers?: MapLayers;
  reportTypes?: ReportType[];
  sectorFilter?: string;
  height?: string;
  pick?: LatLng | null;
  onPick?: (p: LatLng) => void;
  zoom?: number;
  center?: LatLng;
}) {
  const activeAlerts = alerts.filter((a) => a.status === "active" && !a.exercise);
  const visibleReports = reports.filter(
    (r) =>
      r.status === "valide" &&
      (!reportTypes || reportTypes.includes(r.type)) &&
      (!sectorFilter || sectorFilter === "all" || r.sector === sectorFilter),
  );

  return (
    <MapContainer center={center ?? ANGRE_CENTER} zoom={zoom} style={{ height, width: "100%" }} scrollWheelZoom>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Recenter center={center} />

      {layers.sectors &&
        sectors.map((s) => (
          <Polygon
            key={s.id}
            positions={s.polygon}
            pathOptions={{
              color: cssVar("--primary"),
              weight: s.pilot ? 3 : 1.5,
              dashArray: s.pilot ? undefined : "6 6",
              fillOpacity: s.pilot ? 0.04 : 0.12,
              fillColor: s.pilot ? cssVar("--primary") : cssVar("--muted-foreground"),
            }}
          >
            <Tooltip sticky>
              <strong>{s.name}</strong> {s.pilot ? "— secteur pilote" : "— hors couverture"}
            </Tooltip>
          </Polygon>
        ))}

      {layers.exposure &&
        exposureZones.map((z, i) => (
          <Circle
            key={i}
            center={z.center}
            radius={z.radius}
            pathOptions={{ stroke: false, fillColor: cssVar(`--expo-${z.level}`), fillOpacity: 0.55 }}
          >
            <Tooltip>Zone à vérifier — classe {z.level}/5 (indicatif)</Tooltip>
          </Circle>
        ))}

      {layers.alerts &&
        activeAlerts.flatMap((a) =>
          a.sectors.map((sid) => {
            const s = sectors.find((x) => x.id === sid)!;
            return (
              <Polygon
                key={a.id + sid}
                positions={s.polygon}
                pathOptions={{ color: cssVar(levelVar[a.level]), weight: 4, fillColor: cssVar(levelVar[a.level]), fillOpacity: 0.18 }}
              >
                <Popup>
                  <strong>{alertLevelLabels[a.level]}</strong>
                  <br />
                  {a.title}
                  <br />
                  <small>Jusqu'à {fmtDateTime(a.validUntil)}</small>
                </Popup>
              </Polygon>
            );
          }),
        )}

      {layers.roads &&
        affectedRoads.map((r) => (
          <Polyline key={r.name} positions={r.path} pathOptions={{ color: cssVar("--level-urgente"), weight: 6, dashArray: "10 6" }}>
            <Tooltip>{r.name} — route affectée</Tooltip>
          </Polyline>
        ))}

      {layers.reports &&
        visibleReports.map((r) => (
          <CircleMarker
            key={r.id}
            center={r.position}
            radius={9}
            pathOptions={{ color: "white", weight: 2, fillColor: cssVar(typeVar[r.type]), fillOpacity: 1 }}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong>{reportTypeLabels[r.type]}</strong>
                <br />
                <small>{fmtDateTime(r.createdAt)} · {waterHeightLabels[r.height]}</small>
                <p style={{ margin: "6px 0" }}>{r.description}</p>
                {r.photo && <img src={r.photo} alt="Photo du signalement" style={{ width: "100%", borderRadius: 4 }} />}
              </div>
            </Popup>
          </CircleMarker>
        ))}

      {onPick && <PickHandler onPick={onPick} />}
      {pick && <Marker position={pick} icon={pinIcon} />}
    </MapContainer>
  );
}
