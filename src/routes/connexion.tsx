import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Page } from "@/components/vigi/common";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Connexion — VigiEau Angré" },
      { name: "description", content: "Connexion ou inscription par e-mail ou téléphone." },
      { property: "og:title", content: "Connexion — VigiEau Angré" },
      { property: "og:description", content: "Connexion ou inscription par e-mail ou téléphone." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Comp,
});

function Comp() {
  const { setRole } = useRole();
  const nav = useNavigate();
  const [consent, setConsent] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole("abonne");
    nav({ to: "/abonnements" });
  };

  return (
    <Page>
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-xl border border-border bg-card shadow-elegant md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-water p-8 text-primary-foreground md:flex">
          <Droplets className="h-10 w-10" />
          <div>
            <h1 className="text-3xl font-bold">Restez alerté à Angré</h1>
            <p className="mt-3 text-sm opacity-90">Recevez les alertes de vos secteurs, suivez vos signalements et gérez vos préférences.</p>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <Tabs defaultValue="login">
            <TabsList className="w-full"><TabsTrigger value="login" className="flex-1">Connexion</TabsTrigger><TabsTrigger value="signup" className="flex-1">Inscription</TabsTrigger></TabsList>
            <TabsContent value="login">
              <form onSubmit={submit} className="mt-4 grid gap-4">
                <div><Label htmlFor="id">E-mail ou téléphone</Label><Input id="id" required placeholder="vous@exemple.ci ou +225…" className="mt-1" /></div>
                <div><Label htmlFor="pw">Mot de passe</Label><Input id="pw" type="password" required className="mt-1" /></div>
                <Button type="submit">Se connecter</Button>
                <button type="button" className="text-left text-sm text-primary underline">Mot de passe oublié ?</button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={submit} className="mt-4 grid gap-4">
                <div><Label htmlFor="name">Nom ou pseudonyme</Label><Input id="name" required className="mt-1" /></div>
                <div><Label htmlFor="id2">E-mail ou téléphone</Label><Input id="id2" required className="mt-1" /></div>
                <div><Label htmlFor="pw2">Mot de passe</Label><Input id="pw2" type="password" required minLength={8} className="mt-1" /></div>
                <label className="flex items-start gap-2 text-sm">
                  <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
                  <span>J'accepte le traitement de mes données selon la <Link to="/donnees-personnelles" className="text-primary underline">politique de confidentialité</Link>.</span>
                </label>
                <Button type="submit" disabled={!consent}>Créer mon compte</Button>
              </form>
            </TabsContent>
          </Tabs>
          <p className="mt-6 text-xs text-muted-foreground">Démo : la connexion vous bascule en rôle « Abonné ».</p>
        </div>
      </div>
    </Page>
  );
}
