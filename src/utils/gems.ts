import { CURRENT_USER_ID } from "../data/mock";
import { Gem, GemDraft } from "../types";

export type GemErrors = Partial<
  Record<
    | "title"
    | "description"
    | "resource_url"
    | "session_date"
    | "target_profiles",
    string
  >
>;

const isValidUrl = (v: string) =>
  /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(v.trim());

const isFutureDate = (v: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  if (Number.isNaN(Date.parse(v))) return false;
  return v >= new Date().toISOString().slice(0, 10);
};

/** Chaque publication doit contenir un livrable : lien, date ou profils recherchés. */
export function validateGem(d: GemDraft): GemErrors {
  const e: GemErrors = {};
  if (d.title.trim().length < 5) {
    e.title = "Donne un titre clair (5 caractères minimum).";
  }
  if (d.description.trim().length < 20) {
    e.description =
      "Explique en 20 caractères minimum ce que les autres y gagnent.";
  }
  if (d.type !== "project" && !isValidUrl(d.resource_url)) {
    e.resource_url = "Un lien valide (https://…) est obligatoire.";
  }
  if (
    d.type === "project" &&
    d.resource_url.trim() &&
    !isValidUrl(d.resource_url)
  ) {
    e.resource_url = "Ce lien n'est pas valide (https://…).";
  }
  if (d.type === "training" && !isFutureDate(d.session_date)) {
    e.session_date = "Date à venir au format AAAA-MM-JJ (ex : 2026-12-05).";
  }
  if (d.type === "project" && d.target_profiles.length === 0) {
    e.target_profiles = "Choisis au moins un profil recherché.";
  }
  return e;
}

export function draftToGem(d: GemDraft): Gem {
  return {
    id: `g${Date.now()}`,
    author_id: CURRENT_USER_ID,
    type: d.type,
    title: d.title.trim(),
    description: d.description.trim(),
    target_profiles: d.type === "project" ? d.target_profiles : [],
    resource_url: d.resource_url.trim() || null,
    session_date: d.type === "training" ? d.session_date.trim() : null,
    project_stage: d.type === "project" ? d.project_stage : null,
    created_at: new Date().toISOString(),
  };
}
