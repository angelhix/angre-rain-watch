import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IndicativeNote, Page, PageHeader } from "@/components/vigi/common";
import { events, sectors, sectorName, fmtDate, exposureClasses, type FloodEvent } from "@/lib/mock-data";
import { useRole, can } from "@/lib/role";

export const Route = createFileRoute("/historique")({
  head: () => ({
    meta: [
      { title: "Historique des inondations — VigiEau Angré" },
      { name: "description", content: "Archives des inondations à Angré : zones touchées, routes coupées, alertes émises et retour d'expérience." },
      { property: "og:title", content: "Historique des inondations — VigiEau Angré" },
      { property: "og:description", content: "Archives et retour d'expérience des inondations à Angré." },
    ],
  }),
  component: HistoriquePage,
});

function HistoriquePage() {
  const { role } = useRole();
  const [sector, setSector] = useState("all");
  const [year, setYear] = useState("all");
  const [open, setOpen] = useState<FloodEvent | null>(null);
  const list = events.filter((e) => (sector === "all" || e.sectors.includes(sector)) && (year === "all" || e.date.startsWith(year)));

  const totals = [1, 2, 3, 4, 5].map((l) => list.reduce((s, e) => s + e.exposureHits[l as 1], 0));
  const sum = totals.reduce((a, b) => a + b, 0) || 1;

  return (
    <Page>
      <PageHeader eyebrow="Après l'inondation" title="Historique et retour d'expérience" description="Chaque événement archivé avec ses alertes, signalements, routes coupées et conséquences connues." />
      <div className="mt-6 flex flex-wrap gap-3">
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tous les secteurs</SelectItem>{sectors.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{["all", "2026", "2025", "2024", "2022"].map((y) => <SelectItem key={y} value={y}>{y === "all" ? "Toutes années" : y}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <ol className="relative grid gap-4 border-l-2 border-border pl-6">
          {list.map((e) => (
            <li key={e.id} className="relative">
              <span className="absolute -left-[31px] top-5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
              <button onClick={() => setOpen(e)} className="w-full rounded-lg border border-border bg-card p-5 text-left transition-shadow hover:shadow-elegant">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">{fmtDate(e.date)}</span>
                  <Badge variant="outline">{e.reliability}</Badge>
                </div>
                <h3 className="mt-1 text-lg font-bold">{e.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{e.consequences}</p>
                <p className="mt-2 text-xs text-muted-foreground">{e.sectors.map(sectorName).join(", ")} · {e.durationH} h · {e.alerts.length} alerte(s) · source : {e.source}</p>
              </button>
            </li>
          ))}
          {list.length === 0 && <p className="text-sm text-muted-foreground">Aucun événement pour ces filtres.</p>}
        </ol>

        <aside className="h-fit rounded-lg border border-border bg-card p-5">
          <h2 className="font-bold">Comparaison avec la carte d'exposition</h2>
          <p className="mt-1 text-xs text-muted-foreground">Part des points touchés par classe de zone.</p>
          <div className="mt-4 grid gap-2">
            {exposureClasses.map((c, i) => (
              <div key={c.level} className="text-sm">
                <div className="flex justify-between"><span>Classe {c.level}</span><span>{Math.round(((totals[i] ?? 0) / sum) * 100)} %</span></div>
                <div className="mt-1 h-2 rounded bg-muted"><div className="h-2 rounded" style={{ width: `${((totals[i] ?? 0) / sum) * 100}%`, background: `var(--expo-${c.level})` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-4"><IndicativeNote>Peu d'événements documentés : résultats indicatifs.</IndicativeNote></div>
        </aside>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-lg">
          {open && (
            <>
              <DialogHeader><DialogTitle>{open.title}</DialogTitle></DialogHeader>
              <div className="grid gap-3 text-sm">
                <p><strong>Secteurs :</strong> {open.sectors.map(sectorName).join(", ")}</p>
                <p><strong>Durée :</strong> {open.durationH} h · <strong>Signalements :</strong> {open.reportsCount}</p>
                <p><strong>Routes coupées :</strong> {open.roadsCut.join(", ") || "—"}</p>
                <p><strong>Alertes :</strong> {open.alerts.join(", ") || "—"}</p>
                <p><strong>Conséquences :</strong> {open.consequences}</p>
                <div>
                  <strong>Chronologie</strong>
                  <ul className="mt-2 grid gap-1">{open.timeline.map((t, i) => <li key={i} className="flex gap-3"><span className="w-12 shrink-0 font-mono text-muted-foreground">{t.at}</span>{t.label}</li>)}</ul>
                </div>
                {can.reports(role) && (
                  <Button variant="outline" onClick={() => toast.success("Génération du bilan PDF (à brancher sur le backend)")}><Download />Rapport de bilan PDF</Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Page>
  );
}
