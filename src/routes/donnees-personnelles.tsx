import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader, RoleGate } from "@/components/vigi/common";
import { can } from "@/lib/role";
void can; void RoleGate;

export const Route = createFileRoute("/donnees-personnelles")({
  head: () => ({
    meta: [
      { title: "Données personnelles — VigiEau Angré" },
      { name: "description", content: "Minimisation, consentement, aucune localisation permanente (loi n° 2013-450)." },
      { property: "og:title", content: "Données personnelles — VigiEau Angré" },
      { property: "og:description", content: "Minimisation, consentement, aucune localisation permanente (loi n° 2013-450)." },
    ],
  }),
  component: Comp,
});

function Comp() {
  return (
    <Page>
      <PageHeader title="Données personnelles" description="Minimisation, consentement, aucune localisation permanente (loi n° 2013-450)." />
      <p className="mt-6 text-sm text-muted-foreground">Section en cours de finalisation.</p>
    </Page>
  );
}
