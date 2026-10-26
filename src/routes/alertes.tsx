import { createFileRoute } from "@tanstack/react-router";
import { Clock, FileText, MapPin } from "lucide-react";
import { Map } from "@/components/vigi/Map";
import { LevelBadge, Page, PageHeader } from "@/components/vigi/common";
import { alerts, alertStatusLabels, fmtDateTime, sectorName } from "@/lib/mock-data";

export const Route = createFileRoute("/alertes")({
  head: () => ({
    meta: [
      { title: "Alertes actives — VigiEau Angré" },
      { name: "description", content: "Carte publique des alertes inondation actives à Angré, avec niveau, consignes et source." },
      { property: "og:title", content: "Alertes actives — VigiEau Angré" },
      { property: "og:description", content: "Alertes inondation validées, consignes et zones concernées à Angré." },
    ],
  }),
  component: AlertesPage,
});

function AlertesPage() {
  const visible = alerts.filter((a) => !a.exercise && ["active", "levee", "expiree"].includes(a.status));
  const active = visible.filter((a) => a.status === "active");
  const past = visible.filter((a) => a.status !== "active");
  return (
    <Page wide>
      <PageHeader
        eyebrow="Pendant l'inondation"
        title="Alertes"
        description="Seules les alertes validées par un opérateur habilité apparaissent ici. Actualisation automatique."
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="h-[520px] overflow-hidden rounded-lg border border-border">
          <Map layers={{ sectors: true, alerts: true, roads: true }} height="100%" />
        </div>
        <div className="grid content-start gap-4">
          <h2 className="text-lg font-bold">Actives ({active.length})</h2>
          {active.map((a) => (
            <article key={a.id} className="rounded-lg border-2 border-level-locale bg-card p-5">
              <div className="flex items-center justify-between gap-2">
                <LevelBadge level={a.level} />
                <span className="text-xs text-muted-foreground">v{a.version} · {a.id}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold">{a.title}</h3>
              <p className="mt-3 rounded-md bg-muted p-3 text-sm">{a.message}</p>
              <ul className="mt-3 grid gap-1 text-sm text-muted-foreground">
                <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" />{a.sectors.map(sectorName).join(", ")}</li>
                <li className="flex gap-2"><Clock className="h-4 w-4 shrink-0" />Émise {fmtDateTime(a.createdAt)} — jusqu'à {fmtDateTime(a.validUntil)}</li>
                <li className="flex gap-2"><FileText className="h-4 w-4 shrink-0" />Source : {a.source}</li>
              </ul>
            </article>
          ))}
          {active.length === 0 && <p className="text-sm text-muted-foreground">Aucune alerte active.</p>}
          <h2 className="mt-4 text-lg font-bold">Récemment levées</h2>
          {past.map((a) => (
            <div key={a.id} className="rounded-lg border border-border p-4 text-sm">
              <div className="flex items-center gap-2"><LevelBadge level={a.level} /><span className="text-muted-foreground">{alertStatusLabels[a.status]}</span></div>
              <p className="mt-2 font-medium">{a.title}</p>
              <p className="text-muted-foreground">{fmtDateTime(a.createdAt)}</p>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">VigiEau Angré n'est pas un système officiel d'alerte. Suivez toujours les consignes des autorités.</p>
        </div>
      </div>
    </Page>
  );
}
