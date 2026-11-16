// ⚠️ MODE DÉMO : réponses simulées. À supprimer quand Supabase (temps réel) sera branché.
export const SIMULATED_DELAY_MS = 1800;

const SIMULATED_REPLIES = [
  "Merci pour ton message ! Je regarde ça et je te réponds en détail.",
  "Avec plaisir, dis-moi ce que tu veux savoir.",
  "Bonne idée, on peut s'appeler 10 minutes cette semaine si tu veux.",
  "Je te conseille de bien préparer ton dossier à l'avance, c'est ce qui a fait la différence pour moi.",
];

export function pickReply(seed: number): string {
  return SIMULATED_REPLIES[seed % SIMULATED_REPLIES.length];
}
