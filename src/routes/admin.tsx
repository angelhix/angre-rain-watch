import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Page, PageHeader, RoleGate } from "@/components/vigi/common";
import { accounts, instructionTemplates, sectors, weatherThresholds } from "@/lib/mock-data";
import { can, roleLabels, type Role } from "@/lib/role";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — VigiEau Angré" },
      { name: "description", content: "Comptes, seuils, secteurs et modèles de consignes." },
      { property: "og:title", content: "Administration — VigiEau Angré" },
      { property: "og:description", content: "Comptes, seuils, secteurs et modèles de consignes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <RoleGate allowed={(r) => can.admin(r)}><Comp /></RoleGate>,
});

function Comp() {
  const [accs, setAccs] = useState(accounts);
  const [th, setTh] = useState(weatherThresholds);
  const [pilot, setPilot] = useState(Object.fromEntries(sectors.map((s) => [s.id, s.pilot])));

  return (
    <Page>
      <PageHeader eyebrow="Administrateur" title="Administration" description="Comptes, seuils, secteurs et modèles de consignes." />
      <Tabs defaultValue="comptes" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="comptes">Comptes</TabsTrigger>
          <TabsTrigger value="seuils">Seuils</TabsTrigger>
          <TabsTrigger value="secteurs">Secteurs</TabsTrigger>
          <TabsTrigger value="modeles">Modèles</TabsTrigger>
        </TabsList>

        <TabsContent value="comptes" className="mt-4">
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
                <tr><th className="p-3">Nom</th><th className="p-3">Identifiant</th><th className="p-3">Rôle</th><th className="p-3">2FA</th><th className="p-3">Actif</th></tr>
              </thead>
              <tbody>
                {accs.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className="p-3 font-medium">{a.name}</td>
                    <td className="p-3 text-muted-foreground">{a.email}</td>
                    <td className="p-3"><Badge variant="secondary">{roleLabels[a.role as Role]}</Badge></td>
                    <td className="p-3">{a.mfa ? <Badge>Activée</Badge> : <Badge variant="outline">Non</Badge>}</td>
                    <td className="p-3"><Switch checked={a.active} onCheckedChange={(v) => setAccs(accs.map((x) => x.id === a.id ? { ...x, active: v } : x))} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="seuils" className="mt-4">
          <div className="grid gap-4 rounded-lg border border-border bg-card p-5 sm:grid-cols-3">
            {([["jaune", "Vigilance jaune"], ["orange", "Vigilance orange"], ["rouge", "Vigilance rouge"]] as const).map(([k, l]) => (
              <div key={k}>
                <Label htmlFor={k}>{l} (mm / 24 h)</Label>
                <Input id={k} type="number" className="mt-1" value={th[k]} onChange={(e) => setTh({ ...th, [k]: Number(e.target.value) })} />
              </div>
            ))}
            <div className="sm:col-span-3"><Button>Enregistrer les seuils</Button></div>
          </div>
        </TabsContent>

        <TabsContent value="secteurs" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {sectors.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div><p className="font-semibold">{s.name}</p><p className="text-xs text-muted-foreground">{s.polygon.length} sommets · {s.id}</p></div>
                <div className="flex items-center gap-2 text-sm">Pilote <Switch checked={!!pilot[s.id]} onCheckedChange={(v) => setPilot({ ...pilot, [s.id]: v })} /></div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="modeles" className="mt-4 grid gap-3">
          {instructionTemplates.map((t) => (
            <div key={t.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{t.name}</p>
                <Badge variant="outline">v{t.version}</Badge>
                {t.approved ? <Badge>Approuvé</Badge> : <Badge variant="destructive">À valider</Badge>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </Page>
  );
}
