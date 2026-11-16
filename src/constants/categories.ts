import { Category } from "../types";

export const CATEGORY_STYLE: Record<
  Category,
  { label: string; bg: string; fg: string }
> = {
  tech: { label: "Tech", bg: "#0038FF", fg: "#FFFFFF" },
  business: { label: "Business", bg: "#0F172A", fg: "#FFFFFF" },
  design: { label: "Design", bg: "#FF5C1A", fg: "#FFFFFF" },
  impact: { label: "Impact", bg: "#BEF264", fg: "#0F172A" },
};
