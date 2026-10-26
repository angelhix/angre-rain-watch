import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { alertLevelLabels, type AlertLevel } from "@/lib/mock-data";
import { useRole, roleLabels, type Role } from "@/lib/role";

export function LevelBadge({ level, className }: { level: AlertLevel; className?: string }) {
  const styles: Record<AlertLevel, string> = {
    vigilance: "bg-level-vigilance text-level-vigilance-foreground",
    locale: "bg-level-locale text-level-locale-foreground",
    urgente: "bg-level-urgente text-level-urgente-foreground",
  };
  return (
    <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide", styles[level], className)}>
      {alertLevelLabels[level]}
    </span>
  );
}

export function ExerciseBadge() {
  return (
    <span className="inline-flex items-center rounded bg-exercise px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-exercise-foreground">
      Exercice
    </span>
  );
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Page({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return <main className={cn("mx-auto w-full px-4 py-8 md:px-6", wide ? "max-w-[1400px]" : "max-w-6xl")}>{children}</main>;
}

export function RoleGate({ allowed, children }: { allowed: (r: Role) => boolean; children: ReactNode }) {
  const { role } = useRole();
  if (allowed(role)) return <>{children}</>;
  return (
    <Page>
      <div className="mx-auto mt-16 max-w-md rounded-lg border border-border bg-card p-8 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-4 text-xl font-bold">Accès réservé</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Votre rôle actuel (<strong>{roleLabels[role]}</strong>) ne permet pas d'accéder à cette page.
          Utilisez le sélecteur de rôle de démonstration en haut de page, ou{" "}
          <Link to="/connexion" className="text-primary underline">connectez-vous</Link>.
        </p>
      </div>
    </Page>
  );
}

export function IndicativeNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-border bg-muted px-3 py-2 text-xs text-muted-foreground">{children}</p>
  );
}
