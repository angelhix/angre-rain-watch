import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "visiteur" | "abonne" | "relais" | "moderateur" | "operateur" | "admin" | "partenaire";

export const roleLabels: Record<Role, string> = {
  visiteur: "Visiteur",
  abonne: "Abonné",
  relais: "Relais local",
  moderateur: "Modérateur",
  operateur: "Opérateur d'alerte",
  admin: "Administrateur",
  partenaire: "Partenaire institutionnel",
};

type Ctx = { role: Role; setRole: (r: Role) => void };
const RoleContext = createContext<Ctx>({ role: "visiteur", setRole: () => {} });

// Démo frontend : le rôle est simulé côté client. Le backend devra appliquer les droits côté serveur (USR-02).
export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("visiteur");
  useEffect(() => {
    const saved = window.localStorage.getItem("vigieau-role") as Role | null;
    if (saved && saved in roleLabels) setRoleState(saved);
  }, []);
  const setRole = (r: Role) => {
    setRoleState(r);
    window.localStorage.setItem("vigieau-role", r);
  };
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export const useRole = () => useContext(RoleContext);

export const can = {
  trackReports: (r: Role) => !["visiteur", "partenaire"].includes(r),
  subscribe: (r: Role) => r !== "visiteur",
  moderate: (r: Role) => r === "moderateur" || r === "admin",
  operate: (r: Role) => r === "operateur",
  audit: (r: Role) => r === "operateur" || r === "admin",
  admin: (r: Role) => r === "admin",
  reports: (r: Role) => ["moderateur", "operateur", "admin", "partenaire"].includes(r),
  acknowledge: (r: Role) => r === "partenaire",
};
