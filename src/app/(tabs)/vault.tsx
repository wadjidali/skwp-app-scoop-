import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BusinessDashboard } from "../../components/dashboard/BusinessDashboard";
import { GemCard } from "../../components/gems/GemCard";
import { VaultEventRow } from "../../components/vault/VaultEventRow";
import { MOCK_GEMS, MOCK_OPPORTUNITIES } from "../../data/mock";
import { enableRemindersWithPrompt } from "../../services/notifications";
import { useAppStore, useHydrated } from "../../store/useAppStore";
import { Opportunity } from "../../types";
import { isExpired } from "../../utils/date";

type Tab = "events" | "resources";
type Mode = "dashboard" | "vault";

function Empty({ title, hint }: { title: string; hint: string }) {
  return (
    <View className="items-center rounded-3xl border-2 border-dashed border-slate-300 p-8">
      <Text className="text-center font-black text-carbon">{title}</Text>
      <Text className="mt-1 text-center text-slate-500">{hint}</Text>
    </View>
  );
}

export default function VaultScreen() {
  const router = useRouter();
  const hydrated = useHydrated();
  const [tab, setTab] = useState<Tab>("events");
  const [mode, setMode] = useState<Mode>("dashboard");

  const isBiz = useAppStore((s) => s.profile.account_type === "business");
  const savedOppIds = useAppStore((s) => s.savedOpportunityIds);
  const statuses = useAppStore((s) => s.myStatuses);
  const savedGemIds = useAppStore((s) => s.savedGemIds);
  const myGems = useAppStore((s) => s.myGems);
  const remindersEnabled = useAppStore((s) => s.remindersEnabled);
  const removeOpportunity = useAppStore((s) => s.removeOpportunity);
  const toggleSaveGem = useAppStore((s) => s.toggleSaveGem);

  // Événements sauvegardés ou marqués "J'y vais / Alumni", deadline la plus proche d'abord
  const events = useMemo(() => {
    const ids = new Set([...savedOppIds, ...Object.keys(statuses)]);
    return MOCK_OPPORTUNITIES.filter((o) => ids.has(o.id)).sort((a, b) => {
      const ea = isExpired(a.deadline);
      const eb = isExpired(b.deadline);
      if (ea !== eb) return ea ? 1 : -1; // les expirés en dernier
      return a.deadline.localeCompare(b.deadline);
    });
  }, [savedOppIds, statuses]);

  const resources = useMemo(
    () => [...myGems, ...MOCK_GEMS].filter((g) => savedGemIds.includes(g.id)),
    [myGems, savedGemIds],
  );

  const confirmRemove = (item: Opportunity) => {
    Alert.alert("Retirer du coffre-fort ?", item.title, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Retirer",
        style: "destructive",
        onPress: () => removeOpportunity(item.id),
      },
    ]);
  };

  if (!hydrated) return <View className="flex-1 bg-paper" />;

  const showDashboard = isBiz && mode === "dashboard";
  const showReminderBanner =
    tab === "events" && events.length > 0 && !remindersEnabled;

  const tabs: { key: Tab; label: string }[] = [
    { key: "events", label: `Événements (${events.length})` },
    { key: "resources", label: `Ressources (${resources.length})` },
  ];

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-paper">
      <View className="px-5 pb-3 pt-2">
        <Text
          className="font-black text-carbon"
          style={{ fontSize: 40, letterSpacing: -2 }}
        >
          {showDashboard ? "DASHBOARD" : "COFFRE-FORT"}
        </Text>
        <Text className="text-sm font-semibold text-slate-500">
          {showDashboard
            ? "Les performances de tes publications."
            : "Ta bibliothèque de carrière."}
        </Text>
      </View>

      {/* Sélecteur propre aux comptes Entreprise */}
      {isBiz && (
        <View className="mb-3 flex-row gap-2 px-5">
          {(
            [
              { key: "dashboard", label: "Dashboard" },
              { key: "vault", label: "Coffre-fort" },
            ] as const
          ).map((m) => {
            const active = mode === m.key;
            return (
              <Pressable
                key={m.key}
                onPress={() => setMode(m.key)}
                className={`flex-1 items-center rounded-full border-2 border-carbon py-2.5 ${
                  active ? "bg-lime" : "bg-white"
                }`}
              >
                <Text className="text-sm font-black text-carbon">
                  {m.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {showDashboard ? (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <BusinessDashboard />
        </ScrollView>
      ) : (
        <>
          <View className="flex-row gap-2 px-5">
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <Pressable
                  key={t.key}
                  onPress={() => setTab(t.key)}
                  className={`rounded-full border-2 border-carbon px-4 py-2 ${
                    active ? "bg-carbon" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-sm font-black ${
                      active ? "text-white" : "text-carbon"
                    }`}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <ScrollView
            className="mt-4"
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {showReminderBanner && (
              <Pressable
                onPress={() => enableRemindersWithPrompt()}
                className="mb-4 flex-row items-center gap-3 rounded-2xl border-2 border-carbon bg-lime p-3 active:opacity-80"
              >
                <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-carbon bg-white">
                  <Bell size={18} color="#0F172A" strokeWidth={3} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-black text-carbon">
                    Ne rate plus une deadline
                  </Text>
                  <Text className="text-xs text-carbon">
                    Active les rappels avant la clôture de tes événements.
                  </Text>
                </View>
              </Pressable>
            )}

            {tab === "events" ? (
              events.length === 0 ? (
                <Empty
                  title="Aucun événement sauvegardé."
                  hint="Swipe à droite sur le Radar pour en ajouter."
                />
              ) : (
                events.map((item) => (
                  <VaultEventRow
                    key={item.id}
                    item={item}
                    status={statuses[item.id]}
                    onOpen={() =>
                      router.push({
                        pathname: "/opportunity/[id]",
                        params: { id: item.id },
                      })
                    }
                    onRemove={() => confirmRemove(item)}
                  />
                ))
              )
            ) : resources.length === 0 ? (
              <Empty
                title="Aucune ressource enregistrée."
                hint="Touche le marque-page d'une pépite pour la garder ici."
              />
            ) : (
              resources.map((gem) => (
                <GemCard
                  key={gem.id}
                  gem={gem}
                  saved
                  onToggleSave={toggleSaveGem}
                />
              ))
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
