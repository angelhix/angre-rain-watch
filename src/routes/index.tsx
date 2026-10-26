import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BellRing, CloudRain, FileWarning, History, MapPinned, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Map } from "@/components/vigi/Map";
import { LevelBadge } from "@/components/vigi/common";
import { alerts, weather, fmtDateTime, sectorName, events } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VigiEau Angré — Prévenir, alerter, apprendre face aux inondations" },
      { name: "description", content: "Carte des zones sensibles, alertes localisées validées et signalements citoyens pour les inondations à Angré, Cocody." },
      { property: "og:title", content: "VigiEau Angré — Prévenir, alerter, apprendre" },
      { property: "og:description", content: "Carte des zones sensibles, alertes localisées et signalements citoyens à Angré." },
    ],
  }),
  component: Home,
});

const indexStyle = {
  vert: "bg-success text-success-foreground",
  jaune: "bg-level-vigilance text-level-vigilance-foreground",
  orange: "bg-level-locale text-level-locale-foreground",
  rouge: "bg-level-urgente text-level-urgente-foreground",
};

function Home() {
  const active = alerts.filter((a) => a.status === "active" && !a.exercise);
  return (
    <main>
      <section className="bg-water text-primary-foreground">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 md:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">Angré · Cocody · Abidjan</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] md:text-6xl">
              Savoir où l'eau monte, avant qu'elle ne coupe la route.
            </h1>
            <p className="mt-5 max-w-xl text-lg opacity-90">
              VigiEau Angré rassemble la carte des zones à surveiller, les signalements des habitants et des alertes
              validées par des opérateurs nommés — avant, pendant et après chaque inondation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/signaler"><FileWarning />Signaler une inondation</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/abonnements"><BellRing />Recevoir les alertes</Link>
              </Button>
            </div>
          </div>
          <div className="h-[360px] overflow-hidden rounded-xl border border-primary-foreground/20 shadow-elegant lg:h-[440px]">
            <Map height="100%" zoom={15} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-3 md:px-6">
        <div className="rounded-lg border border-border bg-card p-5 md:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Alertes actives</h2>
            <Link to="/alertes" className="text-sm text-primary hover:underline">Toutes les alertes</Link>
          </div>
          {active.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Aucune alerte active sur le secteur pilote.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {active.map((a) => (
                <li key={a.id} className="py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <LevelBadge level={a.level} />
                    <span className="font-semibold">{a.title}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {a.sectors.map(sectorName).join(", ")} · émise {fmtDateTime(a.createdAt)} · valable jusqu'à {fmtDateTime(a.validUntil)}
                  </p>
                  <p className="mt-2 text-sm">{a.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link to="/meteo" className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-elegant">
          <div className="flex items-center gap-2 text-muted-foreground"><CloudRain className="h-4 w-4" />Vigilance pluie</div>
          <p className="mt-3 font-display text-5xl font-extrabold">{weather.rain24h}<span className="text-xl font-semibold"> mm</span></p>
          <p className="text-sm text-muted-foreground">cumul prévu sur 24 h</p>
          <span className={`mt-4 inline-block rounded px-2 py-1 text-xs font-bold uppercase ${indexStyle[weather.index]}`}>Indice {weather.index}</span>
          <p className="mt-3 text-xs text-muted-foreground">Source {weather.source} · mise à jour {fmtDateTime(weather.updatedAt)}</p>
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-2xl font-bold md:text-3xl">Trois temps, un même outil</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { icon: MapPinned, phase: "Avant", title: "Prévention", text: "Carte d'exposition indicative, signalements de terrain, priorisation des points à inspecter et scénarios de drainage.", to: "/carte" },
            { icon: BellRing, phase: "Pendant", title: "Alerte et information", text: "Alertes validées par un opérateur, carte publique des alertes actives, notifications aux abonnés du secteur.", to: "/alertes" },
            { icon: History, phase: "Après", title: "Retour d'expérience", text: "Archivage des zones touchées et routes coupées, comparaison avec la carte, bilans pour les équipes techniques.", to: "/historique" },
          ].map((c) => (
            <Link key={c.phase} to={c.to} className="group rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-elegant">
              <c.icon className="h-6 w-6 text-primary" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{c.phase}</p>
              <h3 className="mt-1 text-xl font-bold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Découvrir <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-6xl gap-4 px-4 md:grid-cols-2 md:px-6">
        <div className="rounded-lg bg-secondary p-6">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h3 className="mt-3 text-lg font-bold">Ce que VigiEau garantit</h3>
          <p className="mt-2 text-sm text-secondary-foreground">
            Aucune alerte n'est diffusée sans validation d'un opérateur habilité ; double validation pour le niveau urgent.
            Chaque action est tracée. Aucun signalement n'est public avant modération.
          </p>
        </div>
        <div className="rounded-lg border border-border p-6">
          <h3 className="text-lg font-bold">Ce que VigiEau ne promet pas</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Pas de prédiction certaine, pas de diffusion à tous les téléphones du quartier, pas de statut d'alerte officielle.{" "}
            <Link to="/a-propos" className="text-primary underline">En savoir plus</Link>
          </p>
          <p className="mt-3 text-xs text-muted-foreground">{events.length} événements archivés depuis 2022.</p>
        </div>
      </section>
    </main>
  );
}
