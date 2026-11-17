import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CURRENT_USER_ID, MOCK_CONVERSATIONS } from "../data/mock";
import {
  Conversation,
  Gem,
  Message,
  MyProfile,
  PlanId,
  SocialStatus,
} from "../types";

type State = {
  onboardingDone: boolean;
  signedIn: boolean;
  profile: MyProfile;
  plan: PlanId;
  savedOpportunityIds: string[];
  savedGemIds: string[];
  myStatuses: Record<string, SocialStatus>; // opportunityId → "going" | "alumni"
  myGems: Gem[];
  isIncognito: boolean;
  conversations: Conversation[];
  seenSwipeTutorial: boolean;
  remindersEnabled: boolean;
  reminderDays: number[];
};

type ChatContext = { title?: string; suggestion?: string };

type Actions = {
  saveProfile: (profile: MyProfile) => void;
  setSignedIn: (value: boolean) => void;
  setPlan: (plan: PlanId) => void;
  saveOpportunity: (id: string) => void;
  removeOpportunity: (id: string) => void;
  toggleStatus: (id: string, status: SocialStatus) => void;
  toggleSaveGem: (id: string) => void;
  addGem: (gem: Gem) => void;
  setIncognito: (value: boolean) => void;
  startConversation: (peerId: string, ctx?: ChatContext) => string;
  sendMessage: (conversationId: string, body: string) => void;
  receiveMessage: (conversationId: string, body: string) => void;
  markRead: (conversationId: string) => void;
  setSeenSwipeTutorial: (value: boolean) => void;
  setRemindersEnabled: (value: boolean) => void;
  setReminderDays: (days: number[]) => void;
  reset: () => void;
};

export const DEFAULT_PROFILE: MyProfile = {
  account_type: "person",
  full_name: "",
  org_name: "",
  website: "",
  role: "junior",
  bio_short: "",
  contact_link: "",
  avatar_url: null,
  country: "",
  interests: [],
};

const initialState: State = {
  onboardingDone: false,
  signedIn: false,
  profile: DEFAULT_PROFILE,
  plan: "free",
  savedOpportunityIds: [],
  savedGemIds: [],
  myStatuses: {},
  myGems: [],
  isIncognito: false,
  conversations: MOCK_CONVERSATIONS,
  seenSwipeTutorial: false,
  remindersEnabled: false,
  reminderDays: [3, 1],
};

const makeMessage = (
  conversation_id: string,
  sender_id: string,
  body: string,
): Message => ({
  id: `m${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
  conversation_id,
  sender_id,
  body,
  created_at: new Date().toISOString(),
});

export const useAppStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      saveProfile: (profile) => set({ profile, onboardingDone: true }),

      setSignedIn: (value) => set({ signedIn: value }),

      setPlan: (plan) => set({ plan }),

      saveOpportunity: (id) =>
        set((s) =>
          s.savedOpportunityIds.includes(id)
            ? s
            : { savedOpportunityIds: [...s.savedOpportunityIds, id] },
        ),

      removeOpportunity: (id) =>
        set((s) => {
          const statuses = { ...s.myStatuses };
          delete statuses[id];
          return {
            savedOpportunityIds: s.savedOpportunityIds.filter((x) => x !== id),
            myStatuses: statuses,
          };
        }),

      toggleStatus: (id, status) =>
        set((s) => {
          const next = { ...s.myStatuses };
          if (next[id] === status) delete next[id];
          else next[id] = status;
          return { myStatuses: next };
        }),

      toggleSaveGem: (id) =>
        set((s) => ({
          savedGemIds: s.savedGemIds.includes(id)
            ? s.savedGemIds.filter((x) => x !== id)
            : [...s.savedGemIds, id],
        })),

      addGem: (gem) => set((s) => ({ myGems: [gem, ...s.myGems] })),

      setIncognito: (value) => set({ isIncognito: value }),

      /** Ouvre la conversation existante avec ce membre, ou en crée une. Renvoie son id. */
      startConversation: (peerId, ctx) => {
        const existing = get().conversations.find((c) => c.peer_id === peerId);
        if (existing) return existing.id;
        const conversation: Conversation = {
          id: `c${Date.now()}`,
          peer_id: peerId,
          context_title: ctx?.title ?? null,
          suggestion: ctx?.suggestion ?? null,
          messages: [],
          unread: 0,
          updated_at: new Date().toISOString(),
        };
        set((s) => ({ conversations: [conversation, ...s.conversations] }));
        return conversation.id;
      },

      sendMessage: (conversationId, body) => {
        const text = body.trim();
        if (!text) return;
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    makeMessage(conversationId, CURRENT_USER_ID, text),
                  ],
                  updated_at: new Date().toISOString(),
                }
              : c,
          ),
        }));
      },

      receiveMessage: (conversationId, body) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    makeMessage(conversationId, c.peer_id, body),
                  ],
                  unread: c.unread + 1,
                  updated_at: new Date().toISOString(),
                }
              : c,
          ),
        })),

      markRead: (conversationId) =>
        set((s) =>
          s.conversations.some((c) => c.id === conversationId && c.unread > 0)
            ? {
                conversations: s.conversations.map((c) =>
                  c.id === conversationId ? { ...c, unread: 0 } : c,
                ),
              }
            : s,
        ),

      setSeenSwipeTutorial: (value) => set({ seenSwipeTutorial: value }),

      setRemindersEnabled: (value) => set({ remindersEnabled: value }),

      setReminderDays: (days) => set({ reminderDays: days }),

      reset: () => set(initialState),
    }),
    {
      name: "skwp-store-v1",
      storage: createJSONStorage(() => AsyncStorage),
      // Les anciennes données enregistrées sont complétées par les valeurs par défaut
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<State>;
        return {
          ...current,
          ...p,
          // Les profils créés avant cette version sont considérés comme connectés
          signedIn: p.signedIn ?? p.onboardingDone ?? false,
          profile: { ...current.profile, ...p.profile },
        };
      },
    },
  ),
);

/** Vrai quand les données sauvegardées sont rechargées depuis AsyncStorage. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(useAppStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    setHydrated(useAppStore.persist.hasHydrated());
    return unsub;
  }, []);
  return hydrated;
}
