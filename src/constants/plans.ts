import { PlanId } from "../types";
import { FREE_POSTS_LIMIT } from "./profile";

export type PlanFeature = { label: string; soon?: boolean };

export type Plan = {
  id: Exclude<PlanId, "free">;
  name: string;
  price: string;
  period: string;
  postLimit: number; // Infinity = illimité
  popular?: boolean;
  features: PlanFeature[];
};

export const PLAN_NAME: Record<PlanId, string> = {
  free: "Gratuite",
  pro: "Pro",
  business: "Business",
};

// Prix et contenus provisoires : à adapter
export const PLANS: Plan[] = [
  {
    id: "pro",
    name: "Pro",
    price: "5 000 FCFA",
    period: "/ mois",
    postLimit: 15,
    popular: true,
    features: [
      { label: "15 publications" },
      { label: "Tableau de bord : vues, clics, inscriptions" },
      { label: "Badge « Entreprise vérifiée »", soon: true },
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "15 000 FCFA",
    period: "/ mois",
    postLimit: Infinity,
    features: [
      { label: "Publications illimitées" },
      { label: "Tableau de bord complet : évolution sur 7 jours" },
      { label: "Exports des statistiques", soon: true },
      { label: "Mise en avant sur le Radar", soon: true },
      { label: "Messagerie prioritaire", soon: true },
    ],
  },
];

export function getPostLimit(plan: PlanId): number {
  if (plan === "free") return FREE_POSTS_LIMIT;
  return PLANS.find((p) => p.id === plan)?.postLimit ?? FREE_POSTS_LIMIT;
}

export function quotaLabel(plan: PlanId, used: number): string {
  const limit = getPostLimit(plan);
  if (plan === "free")
    return `${Math.min(used, limit)}/${limit} publications gratuites`;
  if (limit === Infinity)
    return `${used} publications · Offre ${PLAN_NAME[plan]}`;
  return `${Math.min(used, limit)}/${limit} publications · Offre ${PLAN_NAME[plan]}`;
}
