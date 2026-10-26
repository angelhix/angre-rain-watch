import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader, RoleGate } from "@/components/vigi/common";
import { can } from "@/lib/role";
void can; void RoleGate;

export const Route = createFileRoute("/priorisation")({
  head: () => ({
    meta: [
      { title: "Priorisation des points — VigiEau Angré" },
      { name: "description", content: "Score de priorité 0–100, rapports d'inspection et scénarios préliminaires de drainage." },
      { property: "og:title", content: "Priorisation des points — VigiEau Angré" },
      { property: "og:description", content: "Score de priorité 0–100, rapports d'inspection et scénarios préliminaires de drainage." },
    ],
  }),
  component: () => <RoleGate allowed={(r) => can.reports(r)}><Comp /></RoleGate>,
});

function Comp() {
  return (
    <Page>
      <PageHeader title="Priorisation des points" description="Score de priorité 0–100, rapports d'inspection et scénarios préliminaires de drainage." />
      <p className="mt-6 text-sm text-muted-foreground">Section en cours de finalisation.</p>
    </Page>
  );
}
