import { Gem } from "../types";

// ⚠️ MODE DÉMO : chiffres simulés. À remplacer par de vrais événements (vue, clic, inscription)
// enregistrés côté serveur quand Supabase sera branché.
const DEMO_MIN_AGE_DAYS = 6; // pour que le graphique de 7 jours soit visible dès le premier jour

export interface GemStats {
  views: number;
  clicks: number;
  conversions: number; // inscriptions (formation), ouvertures (document), alliés (projet)
  saves: number;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Nombre pseudo-aléatoire stable entre 0 et 1. */
function seeded(seed: number, n: number): number {
  const x = Math.sin(seed * 9301 + n * 49297) * 233280;
  return x - Math.floor(x);
}

function ageDays(g: Gem): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const created = new Date(g.created_at);
  created.setHours(0, 0, 0, 0);
  const real = Math.max(
    0,
    Math.round((today.getTime() - created.getTime()) / 86_400_000),
  );
  return Math.max(real, DEMO_MIN_AGE_DAYS);
}

/** Vues d'une pépite il y a k jours (k = 0 : aujourd'hui, journée en cours). */
function viewsOn(g: Gem, k: number): number {
  if (k > ageDays(g)) return 0;
  const h = hash(g.id);
  const base = 14 + (h % 26);
  const noise = 0.6 + seeded(h, k) * 0.8;
  return Math.round(base * noise * (k === 0 ? 0.6 : 1));
}

export function gemStats(g: Gem): GemStats {
  const h = hash(g.id);
  let views = 0;
  const last = Math.min(ageDays(g), 29);
  for (let k = 0; k <= last; k++) views += viewsOn(g, k);

  const clicks = Math.round(views * (0.18 + seeded(h, 101) * 0.12));
  const conversions = Math.round(clicks * (0.25 + seeded(h, 102) * 0.2));
  const saves = Math.round(views * (0.05 + seeded(h, 103) * 0.05));
  return { views, clicks, conversions, saves };
}

/** Vues cumulées de toutes les pépites sur les 7 derniers jours (le plus ancien en premier). */
export function weeklyTrend(gems: Gem[]): number[] {
  return Array.from({ length: 7 }, (_, i) =>
    gems.reduce((sum, g) => sum + viewsOn(g, 6 - i), 0),
  );
}

export function weekLabels(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d
      .toLocaleDateString("fr-FR", { weekday: "short" })
      .replace(".", "")
      .slice(0, 3);
  });
}
