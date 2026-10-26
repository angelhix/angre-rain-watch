import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-muted">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm md:grid-cols-3 md:px-6">
        <div>
          <p className="font-display text-base font-bold">VigiEau Angré</p>
          <p className="mt-2 text-muted-foreground">
            Prototype académique — ESATIC, Licence 3 TWIN3. Plateforme non officielle : elle ne remplace pas les canaux des autorités.
          </p>
        </div>
        <div className="grid gap-1">
          <Link to="/a-propos" className="hover:underline">À propos et limites</Link>
          <Link to="/donnees-personnelles" className="hover:underline">Données personnelles</Link>
          <Link to="/abonnements" className="hover:underline">Activer les notifications</Link>
        </div>
        <div className="text-muted-foreground">
          <p><strong className="text-foreground">Urgence :</strong> Sapeurs-pompiers 180 · Police 110 / 111 · SAMU 185</p>
          <p className="mt-2">Fond de carte © contributeurs OpenStreetMap.</p>
        </div>
      </div>
    </footer>
  );
}
