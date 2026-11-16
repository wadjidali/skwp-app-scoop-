import * as Notifications from "expo-notifications";
import { Bell } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Pressable, Switch, Text, View } from "react-native";
import {
    enableRemindersWithPrompt,
    scheduleTestReminder,
} from "../../services/notifications";
import { useAppStore } from "../../store/useAppStore";
import { Chip } from "../ui/Chip";

const DAY_OPTIONS = [7, 3, 1];

export function ReminderSettings() {
  const enabled = useAppStore((s) => s.remindersEnabled);
  const days = useAppStore((s) => s.reminderDays);
  const saved = useAppStore((s) => s.savedOpportunityIds);
  const statuses = useAppStore((s) => s.myStatuses);
  const setEnabled = useAppStore((s) => s.setRemindersEnabled);
  const setDays = useAppStore((s) => s.setReminderDays);

  const [pending, setPending] = useState<number | null>(null);

  // Nombre de rappels réellement programmés (laisse 0,7 s à la synchronisation)
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const list = await Notifications.getAllScheduledNotificationsAsync();
        if (!cancelled) setPending(list.length);
      } catch {
        if (!cancelled) setPending(null);
      }
    }, 700);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [enabled, days, saved, statuses]);

  const toggleDay = (d: number) => {
    const next = days.includes(d) ? days.filter((x) => x !== d) : [...days, d];
    if (next.length === 0) return; // au moins un délai
    setDays([...next].sort((a, b) => b - a));
  };

  const sendTest = async () => {
    const ok = await scheduleTestReminder();
    Alert.alert(
      ok ? "Rappel de test programmé" : "Notifications désactivées",
      ok
        ? "Tu le recevras dans 5 secondes."
        : "Autorise les notifications pour SKWP dans les Réglages de ton iPhone.",
    );
  };

  return (
    <View className="gap-3 rounded-3xl border-2 border-carbon bg-white p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <View className="flex-row items-center gap-2">
            <Bell size={18} color="#0F172A" strokeWidth={3} />
            <Text className="text-base font-black text-carbon">
              Rappels de deadline
            </Text>
          </View>
          <Text className="mt-1 text-xs leading-4 text-slate-500">
            Une notification à 9 h avant la clôture des événements de ton
            coffre-fort.
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={(v) => {
            if (v) enableRemindersWithPrompt();
            else setEnabled(false);
          }}
          trackColor={{ false: "#CBD5E1", true: "#BEF264" }}
          thumbColor="#0F172A"
        />
      </View>

      {enabled && (
        <>
          <View className="flex-row flex-wrap gap-2">
            {DAY_OPTIONS.map((d) => (
              <Chip
                key={d}
                label={`${d} j avant`}
                active={days.includes(d)}
                onPress={() => toggleDay(d)}
              />
            ))}
          </View>

          <Text className="text-xs font-semibold text-slate-500">
            {pending === null
              ? "Rappels programmés : …"
              : `${pending} rappel${pending > 1 ? "s" : ""} programmé${pending > 1 ? "s" : ""}`}
          </Text>

          <Pressable
            onPress={sendTest}
            className="items-center rounded-full border-2 border-carbon py-2.5 active:opacity-80"
          >
            <Text className="text-sm font-black text-carbon">
              Envoyer un rappel de test
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
