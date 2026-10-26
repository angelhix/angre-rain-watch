import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Page, PageHeader, RoleGate } from "@/components/vigi/common";
import { reports, reportTypeLabels, reportStatusLabels, fmtDateTime, sectorName } from "@/lib/mock-data";
import { can } from "@/lib/role";

export const Route = createFileRoute("/mes-signalements")({
  head: () => ({
    meta: [
      { title: "Mes signalements — VigiEau Angré" },
      { name: "description", content: "Suivez le statut de vos signalements d'inondation à Angré." },
      { property: "og:title", content: "Mes signalements — VigiEau Angré" },
      { property: "og:description", content: "Statut de vos signalements après modération." },
    ],
  }),
  component: () => <RoleGate allowed={can.trackReports}><MesSignalements /></RoleGate>,
});

const variant = { en_attente: "outline", valide: "default", rejete: "destructive", resolu: "secondary" } as const;

function MesSignalements() {
  const mine = reports.slice(0, 7);
  return (
    <Page>
      <PageHeader title="Mes signalements" description="Le statut se met à jour après vérification par un modérateur." actions={<Button asChild><Link to="/signaler">Nouveau signalement</Link></Button>} />
      <div className="mt-6 grid gap-3">
        {mine.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4">
            {r.photo ? <img src={r.photo} alt="" className="h-14 w-14 rounded object-cover" /> : <div className="h-14 w-14 rounded bg-muted" />}
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{reportTypeLabels[r.type]} <span className="font-normal text-muted-foreground">· {r.id}</span></p>
              <p className="truncate text-sm text-muted-foreground">{r.description}</p>
              <p className="text-xs text-muted-foreground">{sectorName(r.sector)} · {fmtDateTime(r.createdAt)}</p>
              {r.rejectReason && <p className="mt-1 text-xs text-destructive">Motif : {r.rejectReason}</p>}
            </div>
            <Badge variant={variant[r.status]}>{reportStatusLabels[r.status]}</Badge>
          </div>
        ))}
      </div>
    </Page>
  );
}
