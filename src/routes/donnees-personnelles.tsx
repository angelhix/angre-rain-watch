import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Page, PageHeader } from "@/components/vigi/common";

export const Route = createFileRoute("/donnees-personnelles")({
  head: () => ({
    meta: [
      { title: "Données personnelles — VigiEau Angré" },
      { name: "description", content: "Minimisation, consentement, aucune localisation permanente (loi n° 2013-450)." },
      { property: "og:title", content: "Données personnelles — VigiEau Angré" },
      { property: "og:description", content: "Minimisation, consentement, aucune localisation permanente (loi n° 2013-450)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Comp,
});

const principles = [
  ["Minimisation", "Seules les données utiles aux alertes sont collectées."],
  ["Consentement", "Chaque canal de notification est activé par vous."],
  ["Pas de suivi", "Aucune localisation permanente : la position n'est lue qu'au moment d'un signalement."],
];

const faq = [
  ["Quelles données sont collectées ?", "Nom ou pseudonyme, e-mail ou téléphone, secteurs suivis, préférences de notification, et pour les signalements : position ponctuelle, photo facultative et description."],
  ["Combien de temps sont-elles conservées ?", "Compte : jusqu'à sa suppression. Signalements : 24 mois, puis anonymisés pour l'historique. Journaux techniques : 12 mois."],
  ["Qui y a accès ?", "Les modérateurs et opérateurs habilités. Les partenaires institutionnels ne reçoivent que des données agrégées ou anonymisées."],
  ["Quels sont mes droits ?", "Accès, rectification, opposition et suppression, conformément à la loi ivoirienne n° 2013-450 relative à la protection des données à caractère personnel. Autorité de contrôle : ARTCI."],
];

function Comp() {
  return (
    <Page>
      <PageHeader eyebrow="Confidentialité" title="Données personnelles" description="Minimisation, consentement, aucune localisation permanente (loi n° 2013-450)." />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {principles.map(([t, d]) => (
          <div key={t} className="rounded-lg border border-border bg-card p-5">
            <h2 className="font-bold text-primary">{t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
      <Accordion type="single" collapsible className="mt-8 rounded-lg border border-border bg-card px-5">
        {faq.map(([q, a]) => (
          <AccordionItem key={q} value={q!}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="outline">Télécharger mes données</Button>
        <Button variant="destructive">Supprimer mon compte</Button>
      </div>
    </Page>
  );
}
