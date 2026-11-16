import { GemFilter, GemType, ProjectStage, Role } from "../types";

export const GEM_TYPE_STYLE: Record<
  GemType,
  { label: string; bg: string; fg: string }
> = {
  training: { label: "Formation", bg: "#BEF264", fg: "#0F172A" },
  resource: { label: "Document", bg: "#FDE68A", fg: "#0F172A" },
  project: { label: "Projet", bg: "#0038FF", fg: "#FFFFFF" },
};

export const GEM_FILTERS: { key: GemFilter; label: string }[] = [
  { key: "all", label: "Tout" },
  { key: "training", label: "Formations" },
  { key: "resource", label: "Documents" },
  { key: "project", label: "Projets / Alliés" },
];

export const STAGE_LABEL: Record<ProjectStage, string> = {
  idea: "Idée",
  prototype: "Prototype",
  launched: "Lancé",
};

export const TARGET_PROFILE_OPTIONS = [
  "Dev",
  "Designer",
  "Data",
  "Marketing",
  "Business",
  "Mentor senior",
];

export const ROLE_LABEL: Record<Role, string> = {
  junior: "Junior",
  reconversion: "Reconversion",
  senior: "Senior",
};
