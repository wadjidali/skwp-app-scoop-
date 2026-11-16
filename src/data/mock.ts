import {
  Conversion,
  Gem,
  Opportunity,
  Participant,
  Profile,
  SocialStatus,
} from "../types";

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "1",
    title: "Africa Tech Youth Summit",
    organizer: "Pan-African Innovation Hub",
    location: "Kigali, Rwanda",
    funding_type: "fully_funded",
    deadline: "2026-12-12",
    category: "tech",
    summary_points: [
      "Vol, hébergement et repas pris en charge",
      "3 jours d'ateliers IA et startups",
      "Candidature : CV + lettre de motivation courte",
    ],
    apply_url: "https://example.com/apply/1",
  },
  {
    id: "2",
    title: "Global Design Sprint 48h",
    organizer: "Creative Mind Collective",
    location: "Lisbonne, Portugal",
    funding_type: "partial",
    deadline: "2027-01-08",
    category: "design",
    summary_points: [
      "Hébergement offert, transport à ta charge",
      "Équipes mixtes designers / devs",
      "Portfolio demandé (lien suffit)",
    ],
    apply_url: "https://example.com/apply/2",
  },
  {
    id: "3",
    title: "Bourse Leadership Impact",
    organizer: "Fondation Horizon",
    location: "Paris, France",
    funding_type: "fully_funded",
    deadline: "2026-12-30",
    category: "impact",
    summary_points: [
      "Bourse de 6 mois avec mentorat",
      "Ouvert aux 18-30 ans d'Afrique francophone",
      "Projet social à présenter en 2 pages",
    ],
    apply_url: "https://example.com/apply/3",
  },
  {
    id: "4",
    title: "HackTheFuture Online",
    organizer: "OpenCode Foundation",
    location: "En ligne",
    funding_type: "free",
    deadline: "2026-11-28",
    category: "tech",
    summary_points: [
      "Hackathon de 36h, 100 % à distance",
      "Prix : 5 000 $ + mentorat",
      "Équipes de 2 à 4 personnes",
    ],
    apply_url: "https://example.com/apply/4",
  },
  {
    id: "5",
    title: "Startup Founders Retreat",
    organizer: "Venture Africa",
    location: "Nairobi, Kenya",
    funding_type: "partial",
    deadline: "2027-02-15",
    category: "business",
    summary_points: [
      "Séjour de 5 jours avec investisseurs",
      "Billet d'avion non inclus",
      "Pitch de 3 minutes à préparer",
    ],
    apply_url: "https://example.com/apply/5",
  },
  {
    id: "6",
    title: "Women in Data Fellowship",
    organizer: "DataBridge Institute",
    location: "Dakar, Sénégal",
    funding_type: "fully_funded",
    deadline: "2027-01-20",
    category: "tech",
    summary_points: [
      "Formation intensive data science de 8 semaines",
      "Allocation mensuelle incluse",
      "Niveau junior ou reconversion accepté",
    ],
    apply_url: "https://example.com/apply/6",
  },
];

export const MOCK_PROFILES: Profile[] = [
  {
    id: "u1",
    full_name: "Aminata Diallo",
    avatar_url: null,
    role: "junior",
    bio_short: "Étudiante en data science, cherche sa première mission.",
    contact_link: "https://linkedin.com/in/aminata-diallo-demo",
    is_incognito: false,
  },
  {
    id: "u2",
    full_name: "Kwame Mensah",
    avatar_url: null,
    role: "senior",
    bio_short: "Product manager, 10 ans d'expérience, mentor.",
    contact_link: "https://wa.me/233000000000",
    is_incognito: false,
  },
  {
    id: "u3",
    full_name: "Fatou Ndiaye",
    avatar_url: null,
    role: "reconversion",
    bio_short: "Ex-comptable devenue développeuse web.",
    contact_link: "mailto:fatou.demo@example.com",
    is_incognito: false,
  },
  {
    id: "u4",
    full_name: "Yann Kouassi",
    avatar_url: null,
    role: "junior",
    bio_short: "Designer UX, portfolio en construction.",
    contact_link: "https://linkedin.com/in/yann-kouassi-demo",
    is_incognito: false,
  },
  {
    id: "u5",
    full_name: "Membre discret",
    avatar_url: null,
    role: "senior",
    bio_short: "",
    contact_link: "",
    is_incognito: true,
  },
  {
    id: "u6",
    full_name: "Salimata Traoré",
    avatar_url: null,
    role: "senior",
    bio_short: "A participé à 3 sommets, répond aux questions.",
    contact_link: "https://linkedin.com/in/salimata-traore-demo",
    is_incognito: false,
  },
];

export const MOCK_PARTICIPANTS: Participant[] = [
  { user_id: "u1", opportunity_id: "1", status: "going" },
  { user_id: "u3", opportunity_id: "1", status: "going" },
  { user_id: "u5", opportunity_id: "1", status: "going" },
  { user_id: "u2", opportunity_id: "1", status: "alumni" },
  { user_id: "u6", opportunity_id: "1", status: "alumni" },
  { user_id: "u4", opportunity_id: "2", status: "going" },
  { user_id: "u6", opportunity_id: "2", status: "alumni" },
  { user_id: "u1", opportunity_id: "3", status: "going" },
  { user_id: "u2", opportunity_id: "3", status: "alumni" },
  { user_id: "u5", opportunity_id: "3", status: "alumni" },
  { user_id: "u3", opportunity_id: "4", status: "going" },
  { user_id: "u4", opportunity_id: "4", status: "going" },
  { user_id: "u1", opportunity_id: "6", status: "going" },
];

/** Profils visibles + nombre de membres en mode discret pour un événement. */
export function getParticipants(opportunityId: string, status: SocialStatus) {
  const profiles = MOCK_PARTICIPANTS.filter(
    (p) => p.opportunity_id === opportunityId && p.status === status,
  )
    .map((p) => MOCK_PROFILES.find((u) => u.id === p.user_id))
    .filter((u): u is Profile => Boolean(u));

  return {
    visible: profiles.filter((u) => !u.is_incognito),
    hiddenCount: profiles.filter((u) => u.is_incognito).length,
  };
}

export const CURRENT_USER_ID = "me";

export function getProfile(id: string): Profile | undefined {
  return MOCK_PROFILES.find((p) => p.id === id);
}

export const MOCK_GEMS: Gem[] = [
  {
    id: "g1",
    author_id: "u2",
    type: "training",
    title: "Live : réussir son entretien technique",
    description:
      "45 minutes pour apprendre à structurer ses réponses, gérer le stress et poser les bonnes questions au recruteur.",
    target_profiles: [],
    resource_url: "https://example.com/live/entretien",
    session_date: "2026-11-21",
    project_stage: null,
    created_at: "2026-11-14T09:00:00Z",
  },
  {
    id: "g2",
    author_id: "u1",
    type: "project",
    title: "Dashboard de suivi des prix du marché",
    description:
      "Je construis une web app qui compare les prix des produits de base entre marchés de Dakar, Abidjan et Accra.",
    target_profiles: ["Dev", "Designer"],
    resource_url: null,
    session_date: null,
    project_stage: "prototype",
    created_at: "2026-11-13T15:30:00Z",
  },
  {
    id: "g3",
    author_id: "u6",
    type: "resource",
    title: "Modèle de CV accepté pour une bourse internationale",
    description:
      "Le CV d'une page qui a fonctionné pour trois candidatures fully funded, avec mes annotations section par section.",
    target_profiles: [],
    resource_url: "https://example.com/docs/cv-bourse",
    session_date: null,
    project_stage: null,
    created_at: "2026-11-12T11:00:00Z",
  },
  {
    id: "g4",
    author_id: "u4",
    type: "training",
    title: "Atelier Figma pour débutants (2h)",
    description:
      "On conçoit ensemble un écran mobile de A à Z : grille, composants, auto-layout et prototype cliquable.",
    target_profiles: [],
    resource_url: "https://example.com/atelier/figma",
    session_date: "2026-12-05",
    project_stage: null,
    created_at: "2026-11-11T08:00:00Z",
  },
  {
    id: "g5",
    author_id: "u3",
    type: "project",
    title: "Newsletter bourses d'études francophones",
    description:
      "Une newsletter hebdomadaire qui trie les bourses et programmes ouverts. Déjà 400 abonnés, je cherche des alliés pour la faire grandir.",
    target_profiles: ["Marketing", "Data"],
    resource_url: "https://example.com/newsletter",
    session_date: null,
    project_stage: "launched",
    created_at: "2026-11-09T18:00:00Z",
  },
  {
    id: "g6",
    author_id: "u3",
    type: "resource",
    title: "Checklist visa Schengen pour candidats africains",
    description:
      "La liste des pièces à préparer, des délais réels et des erreurs fréquentes qui font refuser un dossier.",
    target_profiles: [],
    resource_url: "https://example.com/docs/visa-checklist",
    session_date: null,
    project_stage: null,
    created_at: "2026-11-05T10:00:00Z",
  },
];

const minutesAgo = (m: number) =>
  new Date(Date.now() - m * 60_000).toISOString();

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    peer_id: "u2",
    context_title: "Africa Tech Youth Summit",
    suggestion: null,
    messages: [
      {
        id: "m1",
        conversation_id: "c1",
        sender_id: CURRENT_USER_ID,
        body: "Salut Kwame, j'ai vu que tu avais participé au sommet de Kigali. Comment s'est passé l'entretien ?",
        created_at: minutesAgo(190),
      },
      {
        id: "m2",
        conversation_id: "c1",
        sender_id: "u2",
        body: "Salut ! Très bien. Prépare bien ta lettre de motivation, ils lisent tout.",
        created_at: minutesAgo(150),
      },
      {
        id: "m3",
        conversation_id: "c1",
        sender_id: "u2",
        body: "Si tu veux, je peux relire ton dossier avant l'envoi.",
        created_at: minutesAgo(148),
      },
    ],
    unread: 2,
    updated_at: minutesAgo(148),
  },
  {
    id: "c2",
    peer_id: "u6",
    context_title: "Global Design Sprint 48h",
    suggestion: null,
    messages: [
      {
        id: "m4",
        conversation_id: "c2",
        sender_id: CURRENT_USER_ID,
        body: "Bonjour Salimata, le sprint de Lisbonne vaut-il le déplacement ?",
        created_at: minutesAgo(1500),
      },
    ],
    unread: 0,
    updated_at: minutesAgo(1500),
  },
];
