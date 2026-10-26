import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader, RoleGate } from "@/components/vigi/common";
import { can } from "@/lib/role";
void can; void RoleGate;

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — VigiEau Angré" },
      { name: "description", content: "Comptes, seuils, secteurs et modèles de consignes." },
      { property: "og:title", content: "Administration — VigiEau Angré" },
      { property: "og:description", content: "Comptes, seuils, secteurs et modèles de consignes." },
    ],
  }),
  component: () => <RoleGate allowed={(r) => can.admin(r)}><Comp /></RoleGate>,
});

function Comp() {
  return (
    <Page>
      <PageHeader title="Administration" description="Comptes, seuils, secteurs et modèles de consignes." />
      <p className="mt-6 text-sm text-muted-foreground">Section en cours de finalisation.</p>
    </Page>
  );
}
