// Données fictives de démonstration — à remplacer par les appels au backend.

export type LatLng = [number, number];

export type Sector = {
  id: string;
  name: string;
  pilot: boolean;
  polygon: LatLng[];
};

export const ANGRE_CENTER: LatLng = [5.3985, -3.9835];

export const sectors: Sector[] = [
  {
    id: "oscars",
    name: "Les Oscars",
    pilot: false,
    polygon: [
      [5.4065, -3.9985],
      [5.4065, -3.9875],
      [5.3975, -3.9875],
      [5.3975, -3.9985],
    ],
  },
  {
    id: "chateau",
    name: "Château / 9 Kilos",
    pilot: true,
    polygon: [
      [5.3975, -3.9875],
      [5.3975, -3.9755],
      [5.3885, -3.9755],
      [5.3885, -3.9875],
    ],
  },
  {
    id: "djibi",
    name: "Djibi / Djenné",
    pilot: false,
    polygon: [
      [5.4105, -3.9755],
      [5.4105, -3.9635],
      [5.3995, -3.9635],
      [5.3995, -3.9755],
    ],
  },
];

export const sectorName = (id: string) => sectors.find((s) => s.id === id)?.name ?? id;

// Couche "zones à vérifier" — 5 classes (indicatif)
export const exposureClasses = [
  { level: 1, label: "Très faible" },
  { level: 2, label: "Faible" },
  { level: 3, label: "Moyenne" },
  { level: 4, label: "Élevée" },
  { level: 5, label: "Très élevée" },
] as const;

export const exposureZones: { center: LatLng; radius: number; level: 1 | 2 | 3 | 4 | 5 }[] = [
  { center: [5.3932, -3.9812], radius: 160, level: 5 },
  { center: [5.3948, -3.9790], radius: 140, level: 4 },
  { center: [5.3905, -3.9835], radius: 180, level: 4 },
  { center: [5.3958, -3.9850], radius: 150, level: 3 },
  { center: [5.3915, -3.9775], radius: 130, level: 3 },
  { center: [5.3965, -3.9770], radius: 120, level: 2 },
  { center: [5.3895, -3.9860], radius: 110, level: 2 },
  { center: [5.3970, -3.9815], radius: 100, level: 1 },
];

export type ReportType = "route_inondee" | "habitation" | "caniveau_bouche" | "vehicule" | "autre";
export type ReportStatus = "en_attente" | "valide" | "rejete" | "resolu";
export type WaterHeight = "cheville" | "genou" | "taille" | "plus";

export const reportTypeLabels: Record<ReportType, string> = {
  route_inondee: "Route inondée",
  habitation: "Habitation touchée",
  caniveau_bouche: "Caniveau bouché",
  vehicule: "Véhicule bloqué",
  autre: "Autre",
};

export const waterHeightLabels: Record<WaterHeight, string> = {
  cheville: "Cheville (< 15 cm)",
  genou: "Genou (15–50 cm)",
  taille: "Taille (50–100 cm)",
  plus: "Plus de 1 m",
};

export const reportStatusLabels: Record<ReportStatus, string> = {
  en_attente: "En attente",
  valide: "Validé",
  rejete: "Rejeté",
  resolu: "Résolu",
};

export type Report = {
  id: string;
  type: ReportType;
  status: ReportStatus;
  position: LatLng;
  sector: string;
  height: WaterHeight;
  createdAt: string;
  description: string;
  photo?: string;
  fromRelay: boolean;
  confidence: number;
  duplicateOf?: string;
  rejectReason?: string;
};

export const reports: Report[] = [
  {
    id: "S-1042",
    type: "route_inondee",
    status: "valide",
    position: [5.3931, -3.9814],
    sector: "chateau",
    height: "genou",
    createdAt: "2026-10-26T18:42:00Z",
    description: "Carrefour 9 Kilos impraticable, eau qui monte vers la pharmacie.",
    photo: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=70",
    fromRelay: true,
    confidence: 85,
  },
  {
    id: "S-1043",
    type: "caniveau_bouche",
    status: "valide",
    position: [5.3947, -3.9792],
    sector: "chateau",
    height: "cheville",
    createdAt: "2026-10-26T18:55:00Z",
    description: "Caniveau rempli de déchets devant l'école, débordement.",
    fromRelay: false,
    confidence: 60,
  },
  {
    id: "S-1044",
    type: "route_inondee",
    status: "en_attente",
    position: [5.3933, -3.9811],
    sector: "chateau",
    height: "genou",
    createdAt: "2026-10-26T19:10:00Z",
    description: "Rue Ministre coupée près du carrefour.",
    fromRelay: false,
    confidence: 55,
  },
  {
    id: "S-1045",
    type: "habitation",
    status: "en_attente",
    position: [5.3906, -3.9833],
    sector: "chateau",
    height: "taille",
    createdAt: "2026-10-26T19:22:00Z",
    description: "L'eau entre dans les cours de trois maisons.",
    photo: "https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?w=600&q=70",
    fromRelay: true,
    confidence: 80,
  },
  {
    id: "S-1046",
    type: "vehicule",
    status: "en_attente",
    position: [5.3918, -3.9779],
    sector: "chateau",
    height: "genou",
    createdAt: "2026-10-26T19:31:00Z",
    description: "Taxi bloqué dans l'eau.",
    fromRelay: false,
    confidence: 50,
  },
  {
    id: "S-1031",
    type: "route_inondee",
    status: "resolu",
    position: [5.3958, -3.9848],
    sector: "chateau",
    height: "cheville",
    createdAt: "2026-10-20T07:10:00Z",
    description: "Flaque importante, circulation ralentie.",
    fromRelay: false,
    confidence: 60,
  },
  {
    id: "S-1020",
    type: "autre",
    status: "rejete",
    position: [5.4010, -3.9920],
    sector: "oscars",
    height: "cheville",
    createdAt: "2026-10-18T10:00:00Z",
    description: "Test",
    fromRelay: false,
    confidence: 20,
    rejectReason: "Signalement de test / non pertinent",
  },
];

export type AlertLevel = "vigilance" | "locale" | "urgente";
export type AlertStatus = "brouillon" | "attente_validation" | "attente_2e_validation" | "active" | "levee" | "expiree";

export const alertLevelLabels: Record<AlertLevel, string> = {
  vigilance: "Vigilance",
  locale: "Alerte locale",
  urgente: "Alerte urgente",
};

export const alertStatusLabels: Record<AlertStatus, string> = {
  brouillon: "Brouillon",
  attente_validation: "En attente de validation",
  attente_2e_validation: "En attente de 2e validation",
  active: "Active",
  levee: "Levée",
  expiree: "Expirée",
};

export type Alert = {
  id: string;
  level: AlertLevel;
  status: AlertStatus;
  title: string;
  sectors: string[];
  templateId: string;
  message: string;
  source: string;
  createdAt: string;
  validUntil: string;
  createdBy: string;
  validatedBy: string[];
  exercise: boolean;
  version: number;
};

export const instructionTemplates = [
  {
    id: "T-ROUTE-v2",
    name: "Route coupée",
    version: 2,
    approved: true,
    text: "Évitez le secteur concerné. Ne traversez jamais une route inondée, à pied ou en véhicule. Suivez les consignes des autorités.",
  },
  {
    id: "T-PLUIE-v1",
    name: "Fortes pluies attendues",
    version: 1,
    approved: true,
    text: "De fortes pluies sont attendues. Dégagez caniveaux et évacuations, mettez à l'abri documents et objets de valeur, limitez vos déplacements.",
  },
  {
    id: "T-EVAC-v1",
    name: "Montée des eaux — mise en sécurité",
    version: 1,
    approved: true,
    text: "Montée des eaux en cours. Rejoignez un étage ou un point haut. Coupez l'électricité si l'eau approche. Appelez le 180 (pompiers) en cas de danger.",
  },
  {
    id: "T-LEVEE-v1",
    name: "Levée d'alerte",
    version: 1,
    approved: false,
    text: "L'alerte est levée. Restez prudents : chaussées endommagées et débris possibles.",
  },
];

export const alerts: Alert[] = [
  {
    id: "A-207",
    level: "locale",
    status: "active",
    title: "Carrefour 9 Kilos et Rue Ministre coupés",
    sectors: ["chateau"],
    templateId: "T-ROUTE-v2",
    message: instructionTemplates[0]!.text,
    source: "Signalements validés S-1042, S-1043 (relais local)",
    createdAt: "2026-10-26T19:05:00Z",
    validUntil: "2026-10-27T01:05:00Z",
    createdBy: "op.kone",
    validatedBy: ["op.kone"],
    exercise: false,
    version: 2,
  },
  {
    id: "A-208",
    level: "urgente",
    status: "attente_2e_validation",
    title: "Montée des eaux — habitations touchées",
    sectors: ["chateau"],
    templateId: "T-EVAC-v1",
    message: instructionTemplates[2]!.text,
    source: "Signalement S-1045 (relais) + prévision SODEXAM",
    createdAt: "2026-10-26T19:35:00Z",
    validUntil: "2026-10-27T03:35:00Z",
    createdBy: "op.kone",
    validatedBy: ["op.kone"],
    exercise: false,
    version: 1,
  },
  {
    id: "A-199",
    level: "vigilance",
    status: "levee",
    title: "Fortes pluies attendues sur Angré",
    sectors: ["chateau"],
    templateId: "T-PLUIE-v1",
    message: instructionTemplates[1]!.text,
    source: "Prévision Open-Meteo 24 h : 62 mm",
    createdAt: "2026-10-20T05:00:00Z",
    validUntil: "2026-10-20T20:00:00Z",
    createdBy: "op.yao",
    validatedBy: ["op.yao"],
    exercise: false,
    version: 1,
  },
  {
    id: "EX-012",
    level: "urgente",
    status: "levee",
    title: "EXERCICE — simulation crue carrefour",
    sectors: ["chateau"],
    templateId: "T-EVAC-v1",
    message: instructionTemplates[2]!.text,
    source: "Scénario d'exercice n°3",
    createdAt: "2026-10-15T09:00:00Z",
    validUntil: "2026-10-15T10:00:00Z",
    createdBy: "op.kone",
    validatedBy: ["op.kone", "op.yao"],
    exercise: true,
    version: 1,
  },
];

export const alertProposals = [
  {
    id: "P-55",
    rule: "Signalements rapprochés",
    detail: "3 signalements en 30 min dans un rayon de 200 m (Château / 9 Kilos)",
    suggestedLevel: "locale" as AlertLevel,
    sector: "chateau",
    at: "2026-10-26T19:32:00Z",
  },
  {
    id: "P-56",
    rule: "Seuil météo orange",
    detail: "Cumul prévu 24 h : 48 mm (seuil orange : 40 mm)",
    suggestedLevel: "vigilance" as AlertLevel,
    sector: "chateau",
    at: "2026-10-26T17:00:00Z",
  },
];

export const auditLog = [
  { at: "2026-10-26T19:35:12Z", who: "op.kone", action: "Création alerte A-208 (urgente)" },
  { at: "2026-10-26T19:35:40Z", who: "op.kone", action: "1re validation A-208" },
  { at: "2026-10-26T19:20:03Z", who: "op.kone", action: "Mise à jour A-207 → v2 (zone étendue Rue Ministre)" },
  { at: "2026-10-26T19:05:22Z", who: "op.kone", action: "Validation et diffusion A-207 (312 abonnés)" },
  { at: "2026-10-26T19:04:10Z", who: "mod.traore", action: "Validation signalement S-1043" },
  { at: "2026-10-26T18:50:01Z", who: "mod.traore", action: "Validation signalement S-1042" },
  { at: "2026-10-20T20:00:00Z", who: "système", action: "Expiration et levée A-199 — message envoyé" },
];

export const deliveryLog = [
  { recipient: "abn_8f3a…", channel: "Web Push", at: "2026-10-26T19:05:31Z", status: "Délivré" },
  { recipient: "abn_21c9…", channel: "Web Push", at: "2026-10-26T19:05:32Z", status: "Délivré" },
  { recipient: "abn_77de…", channel: "Courriel", at: "2026-10-26T19:05:35Z", status: "Délivré" },
  { recipient: "abn_0b12…", channel: "Web Push", at: "2026-10-26T19:05:33Z", status: "Échec — relancé" },
  { recipient: "mairie_cocody", channel: "Courriel partenaire", at: "2026-10-26T19:05:36Z", status: "Accusé reçu 19:12" },
];

export type Weather = {
  rain24h: number;
  index: "vert" | "jaune" | "orange" | "rouge";
  source: string;
  updatedAt: string;
  official?: { source: string; level: string; at: string };
  hourly: { h: string; mm: number }[];
};

export const weatherThresholds = { jaune: 20, orange: 40, rouge: 70 };

export const weather: Weather = {
  rain24h: 48,
  index: "orange",
  source: "Open-Meteo",
  updatedAt: "2026-10-26T19:00:00Z",
  hourly: [
    { h: "20h", mm: 6 },
    { h: "22h", mm: 9 },
    { h: "00h", mm: 12 },
    { h: "02h", mm: 8 },
    { h: "04h", mm: 5 },
    { h: "06h", mm: 3 },
    { h: "08h", mm: 2 },
    { h: "10h", mm: 1 },
    { h: "12h", mm: 0 },
    { h: "14h", mm: 0 },
    { h: "16h", mm: 1 },
    { h: "18h", mm: 1 },
  ],
};

export const affectedRoads: { name: string; path: LatLng[] }[] = [
  {
    name: "Rue Ministre",
    path: [
      [5.3925, -3.9840],
      [5.3931, -3.9814],
      [5.3940, -3.9790],
    ],
  },
];

export type PriorityPoint = {
  id: string;
  name: string;
  position: LatLng;
  recurrence: number; // 0-1
  severity: number;
  exposure: number;
  road: number;
  gis: number;
};

export const defaultWeights = { recurrence: 25, severity: 20, exposure: 20, road: 15, gis: 20 };

export const priorityPoints: PriorityPoint[] = [
  { id: "PT-01", name: "Carrefour 9 Kilos", position: [5.3931, -3.9814], recurrence: 1, severity: 0.8, exposure: 0.9, road: 1, gis: 1 },
  { id: "PT-02", name: "Rue Ministre (pharmacie)", position: [5.3925, -3.984], recurrence: 0.8, severity: 0.7, exposure: 0.7, road: 0.9, gis: 0.8 },
  { id: "PT-03", name: "Caniveau école Château", position: [5.3947, -3.9792], recurrence: 0.6, severity: 0.4, exposure: 0.8, road: 0.4, gis: 0.8 },
  { id: "PT-04", name: "Bas-fond cité SICOGI", position: [5.3906, -3.9833], recurrence: 0.5, severity: 0.9, exposure: 0.9, road: 0.3, gis: 0.8 },
  { id: "PT-05", name: "Voie Château – Djibi", position: [5.3918, -3.9779], recurrence: 0.3, severity: 0.5, exposure: 0.4, road: 0.8, gis: 0.6 },
];

export const drainageScenarios: Record<string, {
  constat: string;
  hypothese: string;
  piste: string;
  etudes: string;
  acteur: string;
  confiance: "faible" | "moyenne" | "élevée";
}> = {
  "PT-01": {
    constat: "Accumulation récurrente au point bas du carrefour lors de pluies > 40 mm.",
    hypothese: "Section du caniveau insuffisante et obstruction par déchets.",
    piste: "Curage régulier ; étude d'un ouvrage de franchissement plus large.",
    etudes: "Levé topographique, relevé du réseau, étude hydraulique.",
    acteur: "Services techniques mairie de Cocody",
    confiance: "moyenne",
  },
  "PT-02": {
    constat: "Ruissellement depuis l'amont le long de la Rue Ministre.",
    hypothese: "Absence d'avaloirs sur 200 m de voirie.",
    piste: "Étudier l'ajout d'avaloirs et un exutoire vers le thalweg.",
    etudes: "Inventaire des avaloirs, bassin versant amont.",
    acteur: "Services techniques / AGEROUTE",
    confiance: "faible",
  },
  "PT-03": {
    constat: "Débordement du caniveau devant l'école.",
    hypothese: "Obstruction par déchets solides.",
    piste: "Curage et sensibilisation des riverains.",
    etudes: "Visite de terrain, suivi après curage.",
    acteur: "Mairie / association de quartier",
    confiance: "élevée",
  },
  "PT-04": {
    constat: "Habitations en bas-fond touchées à chaque épisode majeur.",
    hypothese: "Zone naturelle d'accumulation (TWI élevé).",
    piste: "Étudier la rétention en amont et l'alerte précoce des riverains.",
    etudes: "Étude hydrologique, enquête riverains.",
    acteur: "Mairie, ONPC",
    confiance: "moyenne",
  },
  "PT-05": {
    constat: "Voie coupée ponctuellement.",
    hypothese: "Passage busé sous-dimensionné.",
    piste: "Vérifier l'état de la buse.",
    etudes: "Inspection de l'ouvrage.",
    acteur: "Services techniques",
    confiance: "faible",
  },
};

export type FloodEvent = {
  id: string;
  title: string;
  date: string;
  sectors: string[];
  durationH: number;
  alerts: string[];
  reportsCount: number;
  roadsCut: string[];
  consequences: string;
  source: string;
  reliability: "confirmée" | "probable" | "à recouper";
  exposureHits: Record<1 | 2 | 3 | 4 | 5, number>;
  timeline: { at: string; label: string }[];
};

export const events: FloodEvent[] = [
  {
    id: "EV-2026-10-26",
    title: "Épisode pluvieux du 26 octobre 2026",
    date: "2026-10-26",
    sectors: ["chateau"],
    durationH: 7,
    alerts: ["A-207", "A-208"],
    reportsCount: 5,
    roadsCut: ["Rue Ministre", "Carrefour 9 Kilos"],
    consequences: "Voies coupées, 3 habitations touchées, un véhicule bloqué.",
    source: "Signalements VigiEau",
    reliability: "confirmée",
    exposureHits: { 1: 0, 2: 0, 3: 1, 4: 2, 5: 2 },
    timeline: [
      { at: "17:00", label: "Proposition P-56 (seuil météo orange)" },
      { at: "18:42", label: "Premier signalement (relais local)" },
      { at: "19:05", label: "Alerte locale A-207 diffusée" },
      { at: "19:35", label: "Alerte urgente A-208 créée" },
    ],
  },
  {
    id: "EV-2025-05",
    title: "Inondations de mai 2025",
    date: "2025-05-14",
    sectors: ["chateau", "oscars"],
    durationH: 12,
    alerts: [],
    reportsCount: 0,
    roadsCut: ["Carrefour 9 Kilos"],
    consequences: "Véhicules emportés, habitations touchées (presse).",
    source: "Presse en ligne (annexe A)",
    reliability: "probable",
    exposureHits: { 1: 0, 2: 1, 3: 1, 4: 2, 5: 3 },
    timeline: [{ at: "—", label: "Événement antérieur à la plateforme, saisi depuis la presse" }],
  },
  {
    id: "EV-2024-06",
    title: "Inondations de juin 2024",
    date: "2024-06-18",
    sectors: ["chateau"],
    durationH: 9,
    alerts: [],
    reportsCount: 0,
    roadsCut: ["Rue Ministre"],
    consequences: "Voies coupées autour de la Rue Ministre.",
    source: "Presse en ligne (annexe A)",
    reliability: "à recouper",
    exposureHits: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 2 },
    timeline: [{ at: "—", label: "Saisi depuis la presse" }],
  },
  {
    id: "EV-2022-12",
    title: "Inondations de décembre 2022",
    date: "2022-12-05",
    sectors: ["djibi"],
    durationH: 6,
    alerts: [],
    reportsCount: 0,
    roadsCut: [],
    consequences: "Habitations touchées (presse).",
    source: "Presse en ligne (annexe A)",
    reliability: "à recouper",
    exposureHits: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 0 },
    timeline: [{ at: "—", label: "Saisi depuis la presse" }],
  },
];

export const accounts = [
  { id: "u1", name: "Awa Koné", email: "op.kone@vigieau.ci", role: "operateur", active: true, mfa: true },
  { id: "u2", name: "Serge Yao", email: "op.yao@vigieau.ci", role: "operateur", active: true, mfa: true },
  { id: "u3", name: "Mariam Traoré", email: "mod.traore@vigieau.ci", role: "moderateur", active: true, mfa: false },
  { id: "u4", name: "Syndic Résidence Château", email: "syndic.chateau@mail.ci", role: "relais", active: true, mfa: false },
  { id: "u5", name: "Mairie de Cocody — ST", email: "st@mairie-cocody.ci", role: "partenaire", active: true, mfa: false },
  { id: "u6", name: "Jean Kouassi", email: "+225 07 00 00 00", role: "abonne", active: false, mfa: false },
];

export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Abidjan",
  });

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export function priorityScore(p: PriorityPoint, w = defaultWeights) {
  return Math.round(
    p.recurrence * w.recurrence + p.severity * w.severity + p.exposure * w.exposure + p.road * w.road + p.gis * w.gis,
  );
}
