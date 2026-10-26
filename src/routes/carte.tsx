import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Map, } from "@/components/vigi/Map";
import { IndicativeNote } from "@/components/vigi/common";
import { exposureClasses, reportTypeLabels, sectors, type ReportType } from "@/lib/mock-data";

export const Route = createFileRoute("/carte")({
  head: () => ({
    meta: [
      { title: "Carte interactive d'Angré — VigiEau" },
      { name: "description", content: "Zones à vérifier, signalements validés, routes affectées et alertes actives sur la carte d'Angré." },
      { property: "og:title", content: "Carte interactive d'Angré — VigiEau" },
      { property: "og:description", content: "Zones à vérifier, signalements, routes affectées et alertes actives." },
    ],
  }),
  component: CartePage,
});

function CartePage() {
  const [layers, setLayers] = useState({ sectors: true, exposure: true, reports: true, alerts: true, roads: true });
  const [types, setTypes] = useState<ReportType[]>(Object.keys(reportTypeLabels) as ReportType[]);
  const [sector, setSector] = useState("all");
  const [period, setPeriod] = useState("24h");

  const layerList: { key: keyof typeof layers; label: string }[] = [
    { key: "alerts", label: "Alertes actives" },
    { key: "exposure", label: "Zones à vérifier" },
    { key: "reports", label: "Signalements validés" },
    { key: "roads", label: "Routes affectées" },
    { key: "sectors", label: "Secteurs" },
  ];

  return (
    <main className="grid h-[calc(100vh-7rem)] min-h-[600px] lg:grid-cols-[320px_1fr]">
      <aside className="order-2 overflow-y-auto border-r border-border bg-card p-5 lg:order-1">
        <h1 className="text-2xl font-bold">Carte d'Angré</h1>
        <p className="mt-1 text-sm text-muted-foreground">Secteur pilote : Château / 9 Kilos. Les autres secteurs sont hors couverture.</p>

        <h2 className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Couches</h2>
        <div className="mt-3 grid gap-3">
          {layerList.map((l) => (
            <div key={l.key} className="flex items-center justify-between">
              <Label htmlFor={l.key}>{l.label}</Label>
              <Switch id={l.key} checked={layers[l.key]} onCheckedChange={(v) => setLayers({ ...layers, [l.key]: v })} />
            </div>
          ))}
        </div>

        <h2 className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Filtres</h2>
        <div className="mt-3 grid gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent className="z-[1100]">
              <SelectItem value="24h">Dernières 24 h</SelectItem>
              <SelectItem value="7j">7 derniers jours</SelectItem>
              <SelectItem value="30j">30 derniers jours</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent className="z-[1100]">
              <SelectItem value="all">Tous les secteurs</SelectItem>
              {sectors.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="grid gap-2">
            {(Object.keys(reportTypeLabels) as ReportType[]).map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm">
                <Checkbox checked={types.includes(t)} onCheckedChange={(v) => setTypes(v ? [...types, t] : types.filter((x) => x !== t))} />
                {reportTypeLabels[t]}
              </label>
            ))}
          </div>
        </div>

        <h2 className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Zones à vérifier</h2>
        <div className="mt-3 grid gap-1.5">
          {exposureClasses.map((c) => (
            <div key={c.level} className="flex items-center gap-2 text-sm">
              <span className="h-4 w-6 rounded-sm" style={{ background: `var(--expo-${c.level})` }} />
              Classe {c.level} — {c.label}
            </div>
          ))}
        </div>
        <div className="mt-3">
          <IndicativeNote>Carte <strong>indicative</strong> issue d'une analyse SIG préliminaire (relief, écoulements, distance aux cours d'eau). Elle ne prédit pas les inondations.</IndicativeNote>
        </div>
      </aside>
      <div className="order-1 h-[60vh] lg:order-2 lg:h-full">
        <Map layers={layers} reportTypes={types} sectorFilter={sector} height="100%" />
      </div>
    </main>
  );
}
