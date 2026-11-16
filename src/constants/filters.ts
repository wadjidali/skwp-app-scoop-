import { FundingType, PlaceMode } from "../types";

export const PLACE_OPTIONS: { key: PlaceMode; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "online", label: "En ligne" },
  { key: "onsite", label: "Présentiel" },
];

export const FUNDING_OPTIONS: { key: FundingType; label: string }[] = [
  { key: "fully_funded", label: "Fully funded" },
  { key: "partial", label: "Partiel" },
  { key: "free", label: "Gratuit" },
];
