import { MyProfile } from "../types";

export type ProfileErrors = Partial<
  Record<
    "full_name" | "org_name" | "website" | "contact_link" | "interests",
    string
  >
>;

const URL_RE = /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Accepte un lien, un email ou un numéro WhatsApp (+indicatif). Renvoie un lien exploitable ou null. */
export function normalizeContact(input: string): string | null {
  const v = input.trim();
  if (!v) return null;
  if (EMAIL_RE.test(v)) return `mailto:${v}`;
  if (/^mailto:/i.test(v)) return EMAIL_RE.test(v.slice(7)) ? v : null;

  const digits = v.replace(/[\s().-]/g, "");
  if (/^\+\d{8,15}$/.test(digits)) return `https://wa.me/${digits.slice(1)}`;

  const withScheme = /^https?:\/\//i.test(v)
    ? v
    : /^(www\.|linkedin\.com|wa\.me)/i.test(v)
      ? `https://${v}`
      : null;
  return withScheme && URL_RE.test(withScheme) ? withScheme : null;
}

export function normalizeWebsite(input: string): string | null {
  const v = input.trim();
  if (!v) return "";
  const url = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  return URL_RE.test(url) ? url : null;
}

export function displayName(p: MyProfile): string {
  const name = p.account_type === "business" ? p.org_name : p.full_name;
  return name.trim() || "Toi";
}

export function validateProfile(p: MyProfile): ProfileErrors {
  const e: ProfileErrors = {};
  if (p.account_type === "person" && p.full_name.trim().length < 2) {
    e.full_name = "Indique ton nom (2 caractères minimum).";
  }
  if (p.account_type === "business") {
    if (p.org_name.trim().length < 2) {
      e.org_name = "Indique le nom de l'organisation.";
    }
    if (normalizeWebsite(p.website) === null) {
      e.website = "Ce site n'est pas valide (ex : monsite.com).";
    }
  }
  if (!normalizeContact(p.contact_link)) {
    e.contact_link =
      "Lien LinkedIn, email ou numéro avec indicatif (ex : +221771234567).";
  }
  if (p.interests.length === 0) {
    e.interests = "Choisis au moins un centre d'intérêt.";
  }
  return e;
}

/** Nettoie le brouillon avant sauvegarde (valeurs normalisées, champs inutiles vidés). */
export function finalizeProfile(p: MyProfile): MyProfile {
  const isBiz = p.account_type === "business";
  return {
    ...p,
    full_name: isBiz ? "" : p.full_name.trim(),
    org_name: isBiz ? p.org_name.trim() : "",
    website: isBiz ? (normalizeWebsite(p.website) ?? "") : "",
    bio_short: p.bio_short.trim(),
    contact_link: normalizeContact(p.contact_link) ?? "",
    country: p.country.trim(),
  };
}
