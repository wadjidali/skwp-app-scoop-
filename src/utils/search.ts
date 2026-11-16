import { Gem } from "../types";

/** Minuscules, sans accents, sans espaces superflus. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/** Tous les mots tapés doivent se retrouver dans la pépite. */
export function gemMatches(
  gem: Gem,
  query: string,
  authorName: string,
): boolean {
  const q = normalize(query);
  if (!q) return true;
  const haystack = normalize(
    [gem.title, gem.description, authorName, ...gem.target_profiles].join(" "),
  );
  return q.split(/\s+/).every((word) => haystack.includes(word));
}
