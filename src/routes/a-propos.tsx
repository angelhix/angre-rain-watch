import { createFileRoute } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Page, PageHeader } from "@/components/vigi/common";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos et limites — VigiEau Angré" },
      { name: "description", content: "Ce que VigiEau Angré garantit et ne promet pas." },
      { property: "og:title", content: "À propos et limites — VigiEau Angré" },
      { property: "og:description", content: "Ce que VigiEau Angré garantit et ne promet pas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Comp,
});

const yes = [
  "Des alertes validées par un opérateur humain avant diffusion.",
  "Des signalements citoyens modérés avant publication.",
  "Une carte d'exposition indicative, mise à jour avec les épisodes observés.",
  "La source et l'heure de chaque alerte affichées clairement.",
];
const no = [
  "Prévoir avec certitude chaque inondation.",
  "Remplacer les consignes de l'ONPC, de la mairie ou des secours.",
  "Garantir la réception instantanée des notifications (réseau, batterie).",
  "Fournir une étude d'ingénierie : les scénarios restent préliminaires.",
];

function Comp() {
  return (
    <Page>
      <PageHeader eyebrow="Le projet" title="À propos et limites" description="VigiEau Angré est une plateforme citoyenne de vigilance face aux inondations dans le quartier d'Angré (Cocody, Abidjan)." />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-bold">Ce que nous garantissons</h2>
          <ul className="mt-4 grid gap-3">{yes.map((t) => <li key={t} className="flex gap-2 text-sm"><Check className="h-5 w-5 shrink-0 text-success" />{t}</li>)}</ul>
        </section>
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-bold">Ce que nous ne promettons pas</h2>
          <ul className="mt-4 grid gap-3">{no.map((t) => <li key={t} className="flex gap-2 text-sm"><X className="h-5 w-5 shrink-0 text-destructive" />{t}</li>)}</ul>
        </section>
      </div>
      <section className="mt-6 rounded-lg bg-water p-6 text-primary-foreground">
        <h2 className="text-xl font-bold">En cas de danger immédiat</h2>
        <p className="mt-2 text-sm opacity-90">Appelez les sapeurs-pompiers (180) ou la police secours (110 / 111). N'attendez pas une alerte de la plateforme.</p>
      </section>
    </Page>
  );
}
