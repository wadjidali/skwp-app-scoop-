import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { MOCK_OPPORTUNITIES } from "../data/mock";
import { syncReminders } from "../services/notifications";
import { useAppStore, useHydrated } from "../store/useAppStore";

/** Reprogramme les rappels à chaque changement du Coffre-fort ou des réglages. */
export function useReminderSync() {
  const hydrated = useHydrated();
  const enabled = useAppStore((s) => s.remindersEnabled);
  const days = useAppStore((s) => s.reminderDays);
  const saved = useAppStore((s) => s.savedOpportunityIds);
  const statuses = useAppStore((s) => s.myStatuses);

  useEffect(() => {
    if (!hydrated) return;

    // Événements du Coffre-fort : sauvegardés ou « J'y vais », sans les « Alumni »
    const ids = new Set(saved);
    Object.entries(statuses).forEach(([id, status]) => {
      if (status === "going") ids.add(id);
      if (status === "alumni") ids.delete(id);
    });

    const events = MOCK_OPPORTUNITIES.filter((o) => ids.has(o.id));
    syncReminders(events, days, enabled);
  }, [hydrated, enabled, days, saved, statuses]);
}

/** Ouvre la fiche de l'événement quand on touche un rappel (app ouverte, en arrière-plan ou fermée). */
export function useNotificationTap(ready: boolean) {
  const router = useRouter();
  const last = Notifications.useLastNotificationResponse();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!ready || !last) return;
    if (last.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER)
      return;

    const requestId = last.notification.request.identifier;
    if (handled.current === requestId) return;

    const opportunityId = last.notification.request.content.data?.opportunityId;
    if (typeof opportunityId !== "string") return;

    handled.current = requestId;
    router.push({
      pathname: "/opportunity/[id]",
      params: { id: opportunityId },
    });
  }, [ready, last, router]);
}
