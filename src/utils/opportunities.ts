import { Opportunity, RadarFilters } from "../types";

export const DEFAULT_FILTERS: RadarFilters = {
  place: "all",
  funding: [],
  categories: [],
  countries: [],
};

/** Un événement est en ligne quand son lieu l'indique (en attendant une colonne dédiée côté serveur). */
export function isOnline(o: Opportunity): boolean {
  return /en ligne|online|remote/i.test(o.location);
}

/** Pays = dernier élément de « Ville, Pays ». Null pour un événement en ligne. */
export function countryOf(o: Opportunity): string | null {
  if (isOnline(o)) return null;
  const parts = o.location.split(",");
  return parts[parts.length - 1].trim() || null;
}

export function availableCountries(list: Opportunity[]): string[] {
  const set = new Set<string>();
  list.forEach((o) => {
    const c = countryOf(o);
    if (c) set.add(c);
  });
  return [...set].sort((a, b) => a.localeCompare(b, "fr"));
}

export function toggleIn<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

export function activeFilterCount(f: RadarFilters): number {
  return (
    (f.place !== "all" ? 1 : 0) +
    f.funding.length +
    f.categories.length +
    f.countries.length
  );
}

export function applyFilters(
  list: Opportunity[],
  f: RadarFilters,
): Opportunity[] {
  return list.filter((o) => {
    if (f.place === "online" && !isOnline(o)) return false;
    if (f.place === "onsite" && isOnline(o)) return false;
    if (f.funding.length > 0 && !f.funding.includes(o.funding_type))
      return false;
    if (f.categories.length > 0 && !f.categories.includes(o.category))
      return false;
    if (f.countries.length > 0) {
      const c = countryOf(o);
      if (!c || !f.countries.includes(c)) return false; // le filtre pays ne garde que le présentiel
    }
    return true;
  });
}
