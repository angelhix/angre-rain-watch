import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader, RoleGate } from "@/components/vigi/common";
import { can } from "@/lib/role";
void can; void RoleGate;

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos et limites — VigiEau Angré" },
      { name: "description", content: "Ce que VigiEau Angré garantit et ne promet pas." },
      { property: "og:title", content: "À propos et limites — VigiEau Angré" },
      { property: "og:description", content: "Ce que VigiEau Angré garantit et ne promet pas." },
    ],
  }),
  component: Comp,
});

function Comp() {
  return (
    <Page>
      <PageHeader title="À propos et limites" description="Ce que VigiEau Angré garantit et ne promet pas." />
      <p className="mt-6 text-sm text-muted-foreground">Section en cours de finalisation.</p>
    </Page>
  );
}
