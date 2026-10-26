import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Droplets, Menu, UserCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRole, roleLabels, can, type Role } from "@/lib/role";
import { alerts, sectorName } from "@/lib/mock-data";
import { LevelBadge } from "./common";

export function SiteHeader() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);

  const links: { to: string; label: string; show: boolean }[] = [
    { to: "/carte", label: "Carte", show: true },
    { to: "/alertes", label: "Alertes", show: true },
    { to: "/signaler", label: "Signaler", show: role !== "partenaire" },
    { to: "/meteo", label: "Météo", show: true },
    { to: "/historique", label: "Historique", show: true },
    { to: "/abonnements", label: "Mes abonnements", show: can.subscribe(role) },
    { to: "/mes-signalements", label: "Mes signalements", show: can.trackReports(role) },
    { to: "/moderation", label: "Modération", show: can.moderate(role) },
    { to: "/operateur", label: "Tableau de bord", show: can.operate(role) || role === "partenaire" },
    { to: "/priorisation", label: "Priorisation", show: can.reports(role) },
    { to: "/admin", label: "Administration", show: can.admin(role) },
  ];

  return (
    <header className="sticky top-0 z-[1000] border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 md:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-water text-primary-foreground">
            <Droplets className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold leading-none">
            VigiEau <span className="text-primary">Angré</span>
          </span>
        </Link>
        <nav className="hidden flex-1 items-center gap-1 overflow-x-auto xl:flex">
          {links.filter((l) => l.show).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-secondary text-secondary-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="h-9 w-[170px] text-xs" aria-label="Rôle de démonstration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[1100]">
              {(Object.keys(roleLabels) as Role[]).map((r) => (
                <SelectItem key={r} value={r}>{roleLabels[r]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link to="/connexion"><UserCircle2 className="h-4 w-4" />{role === "visiteur" ? "Connexion" : "Compte"}</Link>
          </Button>
          <Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="grid gap-1 border-t border-border px-4 py-3 xl:hidden">
          {links.filter((l) => l.show).map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              {l.label}
            </Link>
          ))}
          <Link to="/connexion" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">Connexion</Link>
        </nav>
      )}
      <ActiveAlertBanner />
    </header>
  );
}

// NOT-03 : bannière dès l'ouverture si une alerte active concerne les secteurs de l'utilisateur
function ActiveAlertBanner() {
  const active = alerts.filter((a) => a.status === "active" && !a.exercise);
  if (!active.length) return null;
  const a = active[0];
  const bg = { vigilance: "bg-level-vigilance text-level-vigilance-foreground", locale: "bg-level-locale text-level-locale-foreground", urgente: "bg-level-urgente text-level-urgente-foreground" }[a.level];
  return (
    <Link to="/alertes" className={`block ${bg}`}>
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 text-sm md:px-6">
        <LevelBadge level={a.level} className="bg-background/20 text-current" />
        <strong>{a.title}</strong>
        <span className="opacity-90">· {a.sectors.map(sectorName).join(", ")} · source : {a.source.split("(")[0].trim()}</span>
        <span className="ml-auto underline">Voir les consignes →</span>
      </div>
    </Link>
  );
}
