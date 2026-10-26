import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, EyeOff, GitMerge, X, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Page, PageHeader, RoleGate } from "@/components/vigi/common";
import { reports as initial, reportTypeLabels, waterHeightLabels, reportStatusLabels, fmtDateTime, sectorName, type Report, type ReportStatus } from "@/lib/mock-data";
import { can } from "@/lib/role";

export const Route = createFileRoute("/moderation")({
  head: () => ({
    meta: [
      { title: "Modération des signalements — VigiEau Angré" },
      { name: "description", content: "File de modération : valider, rejeter, fusionner les signalements d'inondation." },
      { property: "og:title", content: "Modération — VigiEau Angré" },
      { property: "og:description", content: "Validation des signalements avant publication." },
    ],
  }),
  component: () => <RoleGate allowed={can.moderate}><ModerationPage /></RoleGate>,
});

// Distance approx. en mètres
const dist = (a: [number, number], b: [number, number]) => {
  const dy = (a[0] - b[0]) * 111_320;
  const dx = (a[1] - b[1]) * 111_320 * Math.cos((a[0] * Math.PI) / 180);
  return Math.hypot(dx, dy);
};

function ModerationPage() {
  const [items, setItems] = useState<Report[]>(initial);
  const [rejecting, setRejecting] = useState<Report | null>(null);
  const [reason, setReason] = useState("");
  const [blurred, setBlurred] = useState<Record<string, boolean>>({});

  const duplicates = useMemo(() => {
    const map: Record<string, string> = {};
    for (const r of items.filter((x) => x.status === "en_attente")) {
      const twin = items.find(
        (o) => o.id !== r.id && o.status !== "rejete" && dist(o.position, r.position) <= 50 && Math.abs(+new Date(o.createdAt) - +new Date(r.createdAt)) <= 60 * 60_000,
      );
      if (twin) map[r.id] = twin.id;
    }
    return map;
  }, [items]);

  const setStatus = (id: string, status: ReportStatus, extra: Partial<Report> = {}) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, status, ...extra } : x)));

  const byStatus = (s: ReportStatus) => items.filter((r) => r.status === s);

  const Card = ({ r }: { r: Report }) => (
    <div className="grid gap-4 rounded-lg border border-border bg-card p-4 md:grid-cols-[160px_1fr_auto]">
      {r.photo ? (
        <div className="relative">
          <img src={r.photo} alt="" className={`h-28 w-full rounded object-cover ${blurred[r.id] ? "blur-md" : ""}`} />
          <Button size="sm" variant="secondary" className="absolute bottom-1 left-1 h-7 text-xs" onClick={() => setBlurred({ ...blurred, [r.id]: !blurred[r.id] })}><EyeOff className="h-3 w-3" />{blurred[r.id] ? "Flouté" : "Flouter"}</Button>
        </div>
      ) : <div className="hidden h-28 rounded bg-muted md:block" />}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{reportTypeLabels[r.type]}</span>
          <span className="text-xs text-muted-foreground">{r.id}</span>
          {r.fromRelay && <Badge className="gap-1"><BadgeCheck className="h-3 w-3" />Relais local</Badge>}
          <Badge variant="outline">Confiance {r.confidence}</Badge>
          {duplicates[r.id] && <Badge variant="destructive">Doublon probable de {duplicates[r.id]}</Badge>}
        </div>
        <p className="mt-1 text-sm">{r.description}</p>
        <p className="mt-1 text-xs text-muted-foreground">{sectorName(r.sector)} · {waterHeightLabels[r.height]} · {fmtDateTime(r.createdAt)}</p>
        {r.rejectReason && <p className="mt-1 text-xs text-destructive">Motif : {r.rejectReason}</p>}
      </div>
      {r.status === "en_attente" && (
        <div className="flex flex-wrap gap-2 md:flex-col">
          <Button size="sm" onClick={() => { setStatus(r.id, "valide"); toast.success(`${r.id} validé et publié`); }}><Check />Valider</Button>
          {duplicates[r.id] && <Button size="sm" variant="outline" onClick={() => { setStatus(r.id, "rejete", { duplicateOf: duplicates[r.id], rejectReason: `Fusionné avec ${duplicates[r.id]}` }); toast.success("Fusion effectuée"); }}><GitMerge />Fusionner</Button>}
          <Button size="sm" variant="outline" onClick={() => { setRejecting(r); setReason(""); }}><X />Rejeter</Button>
        </div>
      )}
      {r.status === "valide" && <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "resolu")}>Marquer résolu</Button>}
    </div>
  );

  return (
    <Page>
      <PageHeader eyebrow="Modération" title="File des signalements" description="Aucun signalement n'est public avant validation. Doublons détectés à ≤ 50 m et ≤ 60 min." />
      <Tabs defaultValue="en_attente" className="mt-6">
        <TabsList>
          {(["en_attente", "valide", "resolu", "rejete"] as ReportStatus[]).map((s) => (
            <TabsTrigger key={s} value={s}>{reportStatusLabels[s]} ({byStatus(s).length})</TabsTrigger>
          ))}
        </TabsList>
        {(["en_attente", "valide", "resolu", "rejete"] as ReportStatus[]).map((s) => (
          <TabsContent key={s} value={s} className="grid gap-3">
            {byStatus(s).map((r) => <Card key={r.id} r={r} />)}
            {byStatus(s).length === 0 && <p className="text-sm text-muted-foreground">Rien ici.</p>}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!rejecting} onOpenChange={(o) => !o && setRejecting(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rejeter {rejecting?.id}</DialogTitle></DialogHeader>
          <Textarea placeholder="Motif obligatoire (journalisé)" value={reason} onChange={(e) => setReason(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejecting(null)}>Annuler</Button>
            <Button variant="destructive" disabled={reason.trim().length < 3} onClick={() => { setStatus(rejecting!.id, "rejete", { rejectReason: reason }); setRejecting(null); toast.success("Rejet journalisé"); }}>Rejeter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
