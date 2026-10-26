import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BellRing, Pause, Play, Smartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Page, PageHeader, RoleGate } from "@/components/vigi/common";
import { sectors } from "@/lib/mock-data";
import { can } from "@/lib/role";

export const Route = createFileRoute("/abonnements")({
  head: () => ({
    meta: [
      { title: "Mes abonnements aux alertes — VigiEau Angré" },
      { name: "description", content: "Choisissez vos secteurs d'Angré et vos canaux pour recevoir les alertes inondation." },
      { property: "og:title", content: "Abonnements aux alertes — VigiEau Angré" },
      { property: "og:description", content: "Recevez les alertes inondation de vos secteurs." },
    ],
  }),
  component: () => <RoleGate allowed={can.subscribe}><AbonnementsPage /></RoleGate>,
});

type Sub = { sector: string; paused: boolean };

function AbonnementsPage() {
  const [subs, setSubs] = useState<Sub[]>([{ sector: "chateau", paused: false }]);
  const [channels, setChannels] = useState({ push: true, email: false, sms: false });
  const [consent, setConsent] = useState(false);
  const [notifState, setNotifState] = useState<"inconnu" | "accorde" | "refuse">("inconnu");

  const requestPermission = async () => {
    setConsent(false);
    if (typeof Notification === "undefined") { toast.error("Notifications non prises en charge sur ce navigateur."); return; }
    const res = await Notification.requestPermission();
    setNotifState(res === "granted" ? "accorde" : "refuse");
    if (res !== "granted") toast.info("Notifications refusées : vous verrez quand même la bannière d'alerte dans l'application.");
  };

  return (
    <Page>
      <PageHeader eyebrow="Alertes" title="Mes abonnements" description="Recevez uniquement les alertes des secteurs que vous choisissez." />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="grid content-start gap-4">
          <h2 className="font-bold">Secteurs</h2>
          {sectors.map((s) => {
            const sub = subs.find((x) => x.sector === s.id);
            return (
              <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4">
                <div className="flex-1">
                  <p className="font-semibold">{s.name}</p>
                  {!s.pilot && <p className="text-xs text-muted-foreground">Hors couverture du pilote — abonnement indisponible</p>}
                  {sub && <Badge variant={sub.paused ? "outline" : "default"} className="mt-1">{sub.paused ? "En pause" : "Actif"}</Badge>}
                </div>
                {s.pilot && !sub && <Button size="sm" onClick={() => setSubs([...subs, { sector: s.id, paused: false }])}>S'abonner</Button>}
                {sub && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setSubs(subs.map((x) => (x.sector === s.id ? { ...x, paused: !x.paused } : x)))}>
                      {sub.paused ? <><Play />Reprendre</> : <><Pause />Pause</>}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setSubs(subs.filter((x) => x.sector !== s.id)); toast.success("Désabonnement effectif"); }}><Trash2 />Retirer</Button>
                  </>
                )}
              </div>
            );
          })}

          <h2 className="mt-4 font-bold">Canaux</h2>
          <div className="grid gap-3 rounded-lg border border-border bg-card p-4">
            <label className="flex items-center gap-3 text-sm"><Checkbox checked={channels.push} onCheckedChange={(v) => setChannels({ ...channels, push: !!v })} />Notification sur cet appareil (recommandé)</label>
            <label className="flex items-center gap-3 text-sm"><Checkbox checked={channels.email} onCheckedChange={(v) => setChannels({ ...channels, email: !!v })} />Courriel</label>
            <label className="flex items-center gap-3 text-sm text-muted-foreground"><Checkbox checked={channels.sms} onCheckedChange={(v) => setChannels({ ...channels, sms: !!v })} />SMS (si disponible)</label>
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <div className="rounded-lg bg-secondary p-5">
            <BellRing className="h-6 w-6 text-primary" />
            <h3 className="mt-2 font-bold">Notifications</h3>
            <p className="mt-1 text-sm text-secondary-foreground">
              État : <strong>{notifState === "accorde" ? "activées" : notifState === "refuse" ? "refusées" : "non activées"}</strong>
            </p>
            <Button className="mt-4 w-full" onClick={() => setConsent(true)}>Activer les notifications</Button>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 font-bold"><Smartphone className="h-5 w-5 text-primary" />Guide d'installation</div>
            <Accordion type="single" collapsible className="mt-2">
              <AccordionItem value="android">
                <AccordionTrigger>Android (Chrome)</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">Menu ⋮ → « Installer l'application » ou « Ajouter à l'écran d'accueil », puis ouvrez VigiEau depuis l'icône et activez les notifications.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="ios">
                <AccordionTrigger>iPhone (Safari, iOS 16.4+)</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">Bouton Partager → « Sur l'écran d'accueil ». Ouvrez VigiEau depuis l'écran d'accueil : les notifications ne fonctionnent qu'ainsi.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </aside>
      </div>

      <Dialog open={consent} onOpenChange={setConsent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avant d'activer les notifications</DialogTitle>
            <DialogDescription>
              VigiEau vous enverra uniquement les alertes validées concernant vos secteurs, leurs mises à jour et leur levée.
              Le nombre de messages est limité. Votre position n'est jamais transmise. Vous pouvez vous désabonner à tout moment.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConsent(false)}>Plus tard</Button>
            <Button onClick={requestPermission}>J'accepte, continuer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
