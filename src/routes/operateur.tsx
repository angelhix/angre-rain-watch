import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader, RoleGate } from "@/components/vigi/common";
import { can } from "@/lib/role";
void can; void RoleGate;

export const Route = createFileRoute("/operateur")({
  head: () => ({
    meta: [
      { title: "Tableau de bord opérateur — VigiEau Angré" },
      { name: "description", content: "Propositions, création, validation et levée des alertes, journal d'audit." },
      { property: "og:title", content: "Tableau de bord opérateur — VigiEau Angré" },
      { property: "og:description", content: "Propositions, création, validation et levée des alertes, journal d'audit." },
    ],
  }),
  component: () => <RoleGate allowed={(r) => can.operate(r) || r === 'partenaire'}><Comp /></RoleGate>,
});

function Comp() {
  return (
    <Page>
      <PageHeader title="Tableau de bord opérateur" description="Propositions, création, validation et levée des alertes, journal d'audit." />
      <p className="mt-6 text-sm text-muted-foreground">Section en cours de finalisation.</p>
    </Page>
  );
}
