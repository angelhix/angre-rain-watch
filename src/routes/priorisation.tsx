import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { IndicativeNote, Page, PageHeader, RoleGate } from "@/components/vigi/common";
import { defaultWeights, drainageScenarios, priorityPoints, priorityScore } from "@/lib/mock-data";
import { can, useRole } from "@/lib/role";

export const Route = createFileRoute("/priorisation")({
  head: () => ({
    meta: [
      { title: "Priorisation des points — VigiEau Angré" },
      { name: "description", content: "Score de priorité 0–100, rapports d'inspection et scénarios préliminaires de drainage." },
      { property: "og:title", content: "Priorisation des points — VigiEau Angré" },
      { property: "og:description", content: "Score de priorité 0–100, rapports d'inspection et scénarios préliminaires de drainage." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <RoleGate allowed={(r) => can.reports(r)}><Comp /></RoleGate>,
});

const criteria: { key: keyof typeof defaultWeights; label: string }[] = [
  { key: "recurrence", label: "Récurrence" },
  { key: "severity", label: "Gravité" },
  { key: "exposure", label: "Exposition" },
  { key: "road", label: "Impact voirie" },
  { key: "gis", label: "Indice SIG" },
];

function Comp() {
  const { role } = useRole();
  const [w, setW] = useState(defaultWeights);
  const [sel, setSel] = useState<string>(priorityPoints[0]!.id);
  const [acked, setAcked] = useState<string[]>([]);
  const total = Object.values(w).reduce((a, b) => a + b, 0);
  const ranked = [...priorityPoints].map((p) => ({ p, s: priorityScore(p, w) })).sort((a, b) => b.s - a.s);
  const sc = drainageScenarios[sel];
  const point = priorityPoints.find((p) => p.id === sel)!;

  return (
    <Page wide>
      <PageHeader eyebrow="Aide à la décision" title="Priorisation des points" description="Score 0–100 combinant récurrence, gravité, exposition, voirie et SIG. Ajustez les pondérations pour comparer." />
      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-lg border border-border bg-card p-5">
          <h2 className="font-semibold">Pondérations</h2>
          <p className="text-xs text-muted-foreground">Total : <strong className={total === 100 ? "text-success" : "text-destructive"}>{total}</strong> / 100</p>
          <div className="mt-4 grid gap-5">
            {criteria.map((c) => (
              <div key={c.key}>
                <div className="mb-2 flex justify-between text-sm"><span>{c.label}</span><span className="font-mono">{w[c.key]}</span></div>
                <Slider value={[w[c.key]]} max={50} step={5} onValueChange={([v]) => setW({ ...w, [c.key]: v ?? 0 })} />
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-5 w-full" onClick={() => setW(defaultWeights)}>Réinitialiser</Button>
        </aside>

        <div className="grid gap-6">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            {ranked.map(({ p, s }, i) => (
              <button key={p.id} onClick={() => setSel(p.id)} className={`flex w-full items-center gap-4 border-b border-border p-4 text-left last:border-0 hover:bg-muted ${sel === p.id ? "bg-secondary" : ""}`}>
                <span className="w-6 font-display text-lg font-bold text-muted-foreground">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{p.name}</p>
                  <div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min(s, 100)}%` }} /></div>
                </div>
                <span className={`rounded px-2 py-1 font-mono text-sm font-bold ${s >= 75 ? "bg-level-urgente text-level-urgente-foreground" : s >= 55 ? "bg-level-locale text-level-locale-foreground" : "bg-level-vigilance text-level-vigilance-foreground"}`}>{s}</span>
              </button>
            ))}
          </div>

          {sc && (
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">{point.name}</h2>
                <Badge variant="outline">{point.id}</Badge>
                <Badge variant="secondary">Confiance {sc.confiance}</Badge>
              </div>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                {[["Constat", sc.constat], ["Hypothèse", sc.hypothese], ["Piste d'action", sc.piste], ["Études nécessaires", sc.etudes], ["Acteur pressenti", sc.acteur]].map(([k, v]) => (
                  <div key={k}><dt className="text-xs font-semibold uppercase tracking-wide text-primary">{k}</dt><dd className="mt-1 text-sm">{v}</dd></div>
                ))}
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="outline" size="sm">Exporter le rapport (PDF)</Button>
                {can.acknowledge(role) && (
                  <Button size="sm" disabled={acked.includes(sel)} onClick={() => setAcked([...acked, sel])}>
                    {acked.includes(sel) ? "Réception accusée" : "Accuser réception"}
                  </Button>
                )}
              </div>
              <div className="mt-4"><IndicativeNote>Scénario préliminaire, non contractuel : ne remplace pas une étude d'ingénierie.</IndicativeNote></div>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
