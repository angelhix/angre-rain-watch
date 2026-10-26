import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, CheckCircle2, Crosshair } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Map } from "@/components/vigi/Map";
import { Page, PageHeader } from "@/components/vigi/common";
import { ANGRE_CENTER, reportTypeLabels, waterHeightLabels, type LatLng, type ReportType, type WaterHeight } from "@/lib/mock-data";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/signaler")({
  head: () => ({
    meta: [
      { title: "Signaler une inondation — VigiEau Angré" },
      { name: "description", content: "Signalez en moins de 2 minutes une route inondée, un caniveau bouché ou une habitation touchée à Angré." },
      { property: "og:title", content: "Signaler une inondation — VigiEau Angré" },
      { property: "og:description", content: "Signalement géolocalisé, avec ou sans compte." },
    ],
  }),
  component: SignalerPage,
});

function SignalerPage() {
  const { role } = useRole();
  const [pos, setPos] = useState<LatLng | null>(null);
  const [type, setType] = useState<ReportType>("route_inondee");
  const [height, setHeight] = useState<WaterHeight>("cheville");
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);

  const locate = () => {
    if (!navigator.geolocation) return toast.error("Géolocalisation indisponible : placez le point sur la carte.");
    navigator.geolocation.getCurrentPosition(
      (p) => setPos([p.coords.latitude, p.coords.longitude]),
      () => {
        setPos(ANGRE_CENTER);
        toast.info("Position non autorisée : corrigez le point en touchant la carte.");
      },
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pos) return toast.error("Indiquez la position du problème.");
    // TODO backend : POST du signalement (limitation de débit REP-03, compression + suppression EXIF REP-04)
    setSent("S-" + Math.floor(1000 + Math.random() * 9000));
  };

  if (sent)
    return (
      <Page>
        <div className="mx-auto mt-10 max-w-lg rounded-lg border border-border bg-card p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
          <h1 className="mt-4 text-2xl font-bold">Merci, signalement reçu</h1>
          <p className="mt-2 text-muted-foreground">
            Référence <strong>{sent}</strong>. Il sera visible sur la carte après vérification par un modérateur.
          </p>
          <p className="mt-4 rounded-md bg-muted p-3 text-sm">En cas de danger immédiat, appelez les sapeurs-pompiers au <strong>180</strong>.</p>
          <div className="mt-6 flex justify-center gap-2">
            {role !== "visiteur" && <Button asChild variant="outline"><Link to="/mes-signalements">Suivre mes signalements</Link></Button>}
            <Button onClick={() => { setSent(null); setDesc(""); setPhoto(null); setPos(null); }}>Nouveau signalement</Button>
          </div>
        </div>
      </Page>
    );

  return (
    <Page>
      <PageHeader eyebrow="Signalement" title="Signaler une inondation" description="Sans compte possible. Ne vous mettez jamais en danger pour signaler." />
      <form onSubmit={submit} className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="grid content-start gap-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">1. Position</Label>
            <Button type="button" size="sm" variant="outline" onClick={locate}><Crosshair />Me localiser</Button>
          </div>
          <div className="h-[380px] overflow-hidden rounded-lg border border-border">
            <Map layers={{ sectors: true }} pick={pos} onPick={setPos} center={pos ?? undefined} height="100%" zoom={16} />
          </div>
          <p className="text-xs text-muted-foreground">
            {pos ? `Point : ${pos[0].toFixed(5)}, ${pos[1].toFixed(5)} — touchez la carte pour corriger.` : "Touchez la carte pour placer le point, ou utilisez « Me localiser »."}
          </p>
        </div>

        <div className="grid content-start gap-6">
          <div className="grid gap-3">
            <Label className="text-base font-semibold">2. Type de problème</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(reportTypeLabels) as ReportType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-md border px-3 py-3 text-left text-sm font-medium transition-colors ${type === t ? "border-primary bg-secondary text-secondary-foreground" : "border-border hover:bg-muted"}`}
                >
                  {reportTypeLabels[t]}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            <Label className="text-base font-semibold">3. Hauteur d'eau</Label>
            <RadioGroup value={height} onValueChange={(v) => setHeight(v as WaterHeight)} className="grid grid-cols-2 gap-2">
              {(Object.keys(waterHeightLabels) as WaterHeight[]).map((h) => (
                <label key={h} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                  <RadioGroupItem value={h} />{waterHeightLabels[h]}
                </label>
              ))}
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc" className="text-base font-semibold">4. Description <span className="font-normal text-muted-foreground">(facultatif)</span></Label>
            <Textarea id="desc" maxLength={280} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Ex. : eau jusqu'aux genoux devant la pharmacie" />
            <p className="text-right text-xs text-muted-foreground">{desc.length}/280</p>
          </div>
          <div className="grid gap-2">
            <Label className="text-base font-semibold">5. Photo <span className="font-normal text-muted-foreground">(facultatif)</span></Label>
            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-border p-4 text-sm hover:bg-muted">
              <Camera className="h-5 w-5 text-primary" />
              {photo ? "Photo ajoutée — toucher pour changer" : "Ajouter une photo (compressée, métadonnées supprimées)"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setPhoto(URL.createObjectURL(f)); }} />
            </label>
            {photo && <img src={photo} alt="Aperçu" className="h-32 w-full rounded-md object-cover" />}
            <p className="text-xs text-muted-foreground">Évitez les visages et plaques d'immatriculation.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact">Contact <span className="text-muted-foreground">(facultatif, jamais publié)</span></Label>
            <Input id="contact" placeholder="Téléphone ou e-mail" />
          </div>
          <Button type="submit" size="lg">Envoyer le signalement</Button>
        </div>
      </form>
    </Page>
  );
}
