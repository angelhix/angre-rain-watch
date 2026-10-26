import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader, RoleGate } from "@/components/vigi/common";
import { can } from "@/lib/role";
void can; void RoleGate;

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Connexion — VigiEau Angré" },
      { name: "description", content: "Connexion ou inscription par e-mail ou téléphone." },
      { property: "og:title", content: "Connexion — VigiEau Angré" },
      { property: "og:description", content: "Connexion ou inscription par e-mail ou téléphone." },
    ],
  }),
  component: Comp,
});

function Comp() {
  return (
    <Page>
      <PageHeader title="Connexion" description="Connexion ou inscription par e-mail ou téléphone." />
      <p className="mt-6 text-sm text-muted-foreground">Section en cours de finalisation.</p>
    </Page>
  );
}
