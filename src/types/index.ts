export type FundingType = "fully_funded" | "partial" | "free";
export type Category = "tech" | "business" | "design" | "impact";
export type SwipeDirection = "left" | "right";

export interface Opportunity {
  id: string;
  title: string;
  organizer: string;
  location: string; // Ville, Pays
  funding_type: FundingType;
  deadline: string; // ISO (YYYY-MM-DD)
  category: Category;
  summary_points: [string, string, string];
  apply_url: string;
}

export type Role = "junior" | "reconversion" | "senior";
export type SocialStatus = "going" | "alumni";
export type ParticipantStatus = "saved" | SocialStatus;

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: Role;
  bio_short: string;
  contact_link: string; // LinkedIn / WhatsApp / Email
  is_incognito: boolean;
}

export interface Participant {
  user_id: string;
  opportunity_id: string;
  status: ParticipantStatus;
}

export type GemType = "training" | "resource" | "project";
export type GemFilter = "all" | GemType;
export type ProjectStage = "idea" | "prototype" | "launched";

export interface Gem {
  id: string;
  author_id: string;
  type: GemType;
  title: string;
  description: string;
  target_profiles: string[]; // projets uniquement
  resource_url: string | null;
  session_date: string | null; // formations uniquement (AAAA-MM-JJ)
  project_stage: ProjectStage | null; // projets uniquement
  created_at: string;
}

export interface GemDraft {
  type: GemType;
  title: string;
  description: string;
  resource_url: string;
  session_date: string;
  project_stage: ProjectStage;
  target_profiles: string[];
}

export type AccountType = "person" | "business";

export interface MyProfile {
  account_type: AccountType;
  full_name: string; // personne
  org_name: string; // entreprise
  website: string; // entreprise (optionnel)
  role: Role;
  bio_short: string;
  contact_link: string; // lien https, mailto: ou wa.me
  avatar_url: string | null; // data URI (provisoire, avant Supabase Storage)
  country: string;
  interests: Category[];
}

export type PlanId = "free" | "pro" | "business";

export type PlaceMode = "all" | "online" | "onsite";

export interface RadarFilters {
  place: PlaceMode;
  funding: FundingType[];
  categories: Category[];
  countries: string[];
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string; // CURRENT_USER_ID ou l'id de l'interlocuteur
  body: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  peer_id: string;
  context_title: string | null; // événement à l'origine de la conversation
  suggestion: string | null; // premier message proposé
  messages: Message[];
  unread: number;
  updated_at: string;
}
