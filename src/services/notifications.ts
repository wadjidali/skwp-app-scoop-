import { Alert, Linking } from "react-native";
import * as Notifications from "expo-notifications";
import { useAppStore } from "../store/useAppStore";
import { Opportunity } from "../types";
import { formatDeadline, isExpired } from "../utils/date";

const REMINDER_HOUR = 9; // heure locale d'envoi
const MAX_SCHEDULED = 60; // iOS limite à 64 notifications programmées

/** Affiche aussi les notifications quand l'app est ouverte. À appeler une fois au démarrage. */
export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function hasPermission(): Promise<boolean> {
  const status = await Notifications.getPermissionsAsync();
  return status.granted;
}

/** Demande l'autorisation si elle n'a pas encore été refusée définitivement. */
export async function ensurePermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

/** Active les rappels si l'autorisation est accordée. */
export async function enableReminders(): Promise<boolean> {
  const ok = await ensurePermission();
  useAppStore.getState().setRemindersEnabled(ok);
  return ok;
}

/** Comme enableReminders, avec une alerte qui mène aux Réglages en cas de refus. */
export async function enableRemindersWithPrompt(): Promise<boolean> {
  const ok = await enableReminders();
  if (!ok) {
    Alert.alert(
      "Notifications désactivées",
      "Autorise les notifications pour SKWP dans les Réglages de ton iPhone pour recevoir les rappels.",
      [
        { text: "Plus tard", style: "cancel" },
        { text: "Ouvrir les réglages", onPress: () => Linking.openSettings() },
      ],
    );
  }
  return ok;
}

/** Date locale : 9 h, `daysBefore` jours avant la deadline (AAAA-MM-JJ). */
function reminderDate(deadlineIso: string, daysBefore: number): Date {
  const [y, m, d] = deadlineIso.split("-").map(Number);
  return new Date(y, m - 1, d - daysBefore, REMINDER_HOUR, 0, 0);
}

async function doSync(events: Opportunity[], days: number[], enabled: boolean) {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!enabled || days.length === 0) return;
    if (!(await hasPermission())) return;

    const now = Date.now();
    const planned = events
      .filter((o) => !isExpired(o.deadline))
      .flatMap((o) =>
        days.map((d) => ({ o, d, at: reminderDate(o.deadline, d) })),
      )
      .filter((p) => p.at.getTime() > now)
      .sort((a, b) => a.at.getTime() - b.at.getTime())
      .slice(0, MAX_SCHEDULED);

    for (const p of planned) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: p.d === 1 ? "Deadline demain" : `Deadline dans ${p.d} jours`,
          body: `${p.o.title} · clôture le ${formatDeadline(p.o.deadline)}`,
          data: { opportunityId: p.o.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: p.at,
        },
      });
    }
  } catch (e) {
    console.warn("Rappels : programmation impossible", e);
  }
}

// File d'attente : deux synchronisations ne s'exécutent jamais en même temps (pas de doublons)
let queue: Promise<void> = Promise.resolve();

/** Recalcule tous les rappels à partir des événements, des délais et du réglage. */
export function syncReminders(
  events: Opportunity[],
  days: number[],
  enabled: boolean,
): Promise<void> {
  queue = queue.then(() => doSync(events, days, enabled));
  return queue;
}

/** Rappel de test dans 5 secondes. */
export async function scheduleTestReminder(): Promise<boolean> {
  if (!(await ensurePermission())) return false;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Rappel de test",
      body: "Les rappels de deadline fonctionnent.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
    },
  });
  return true;
}
