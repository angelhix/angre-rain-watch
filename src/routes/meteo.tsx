import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { IndicativeNote, Page, PageHeader } from "@/components/vigi/common";
import { weather, weatherThresholds, fmtDateTime } from "@/lib/mock-data";

export const Route = createFileRoute("/meteo")({
  head: () => ({
    meta: [
      { title: "Météo et vigilance pluie — VigiEau Angré" },
      { name: "description", content: "Cumul de pluie prévu sur 24 h à Angré et indice de vigilance vert, jaune, orange ou rouge." },
      { property: "og:title", content: "Météo et vigilance pluie — VigiEau Angré" },
      { property: "og:description", content: "Prévision de pluie et indice de vigilance pour Angré." },
    ],
  }),
  component: MeteoPage,
});

const scale = [
  { key: "vert", label: "Vert", range: `< ${weatherThresholds.jaune} mm`, cls: "bg-success text-success-foreground" },
  { key: "jaune", label: "Jaune", range: `${weatherThresholds.jaune}–${weatherThresholds.orange} mm`, cls: "bg-level-vigilance text-level-vigilance-foreground" },
  { key: "orange", label: "Orange", range: `${weatherThresholds.orange}–${weatherThresholds.rouge} mm`, cls: "bg-level-locale text-level-locale-foreground" },
  { key: "rouge", label: "Rouge", range: `≥ ${weatherThresholds.rouge} mm`, cls: "bg-level-urgente text-level-urgente-foreground" },
];

function MeteoPage() {
  return (
    <Page>
      <PageHeader eyebrow="Avant l'inondation" title="Météo et vigilance" description="Prévision de pluie pour Angré et indice calculé à partir de seuils paramétrables." />
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Cumul prévu 24 h</p>
          <p className="mt-2 font-display text-6xl font-extrabold">{weather.rain24h}<span className="text-2xl"> mm</span></p>
          <p className="mt-4 text-xs text-muted-foreground">Source {weather.source} · {fmtDateTime(weather.updatedAt)}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 md:col-span-2">
          <p className="text-sm font-semibold">Indice de vigilance</p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {scale.map((s) => (
              <div key={s.key} className={`rounded-md p-3 text-center ${s.cls} ${weather.index === s.key ? "ring-4 ring-ring ring-offset-2" : "opacity-50"}`}>
                <p className="font-bold">{s.label}</p>
                <p className="text-xs">{s.range}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {weather.official ? `Alerte officielle saisie : ${weather.official.source}` : "Aucune alerte météo officielle saisie — l'indice calculé s'applique. Une alerte SODEXAM saisie par un opérateur prime sur le calcul."}
          </p>
        </div>
      </div>
      <div className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="font-bold">Pluie prévue par tranche de 2 h</h2>
        <ChartContainer config={{ mm: { label: "mm", color: "var(--primary)" } }} className="mt-4 h-64 w-full">
          <BarChart data={weather.hourly}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="h" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={30} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="mm" fill="var(--color-mm)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="mt-4">
        <IndicativeNote>En cas d'indisponibilité du service météo, la dernière valeur datée reste affichée avec un message. Prévisions et observations sont conservées pour le rejeu des événements.</IndicativeNote>
      </div>
    </Page>
  );
}
