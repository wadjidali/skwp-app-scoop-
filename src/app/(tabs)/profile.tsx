import { useRouter } from "expo-router";
import { EyeOff, Link2, LogOut, MapPin, Pencil } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaywallModal } from "../../components/premium/PaywallModal";
import { ReminderSettings } from "../../components/settings/ReminderSettings";
import { Avatar } from "../../components/ui/Avatar";
import { CATEGORY_STYLE } from "../../constants/categories";
import { ROLE_LABEL } from "../../constants/gems";
import { PLAN_NAME, getPostLimit } from "../../constants/plans";
import { ACCOUNT_LABEL } from "../../constants/profile";
import { useAppStore, useHydrated } from "../../store/useAppStore";
import { displayName } from "../../utils/profile";

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View className="flex-1 items-center rounded-2xl border-2 border-carbon bg-white py-3">
      <Text className="text-2xl font-black text-carbon">{value}</Text>
      <Text className="text-[11px] font-bold text-slate-500">{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const hydrated = useHydrated();

  const profile = useAppStore((s) => s.profile);
  const isIncognito = useAppStore((s) => s.isIncognito);
  const savedOppIds = useAppStore((s) => s.savedOpportunityIds);
  const statuses = useAppStore((s) => s.myStatuses);
  const savedGemIds = useAppStore((s) => s.savedGemIds);
  const myGems = useAppStore((s) => s.myGems);
  const setIncognito = useAppStore((s) => s.setIncognito);
  const reset = useAppStore((s) => s.reset);
  const plan = useAppStore((s) => s.plan);
  const [showPaywall, setShowPaywall] = useState(false);
  const setSeenSwipeTutorial = useAppStore((s) => s.setSeenSwipeTutorial);
  const setSignedIn = useAppStore((s) => s.setSignedIn);

  if (!hydrated) return <View className="flex-1 bg-paper" />;

  const isBiz = profile.account_type === "business";
  const limit = getPostLimit(plan);
  const name = displayName(profile);
  const statusValues = Object.values(statuses);
  const stats = {
    saved:
      new Set([...savedOppIds, ...Object.keys(statuses)]).size +
      savedGemIds.length,
    going: statusValues.filter((s) => s === "going").length,
    alumni: statusValues.filter((s) => s === "alumni").length,
    published: myGems.length,
  };

  const confirmReset = () =>
    Alert.alert(
      "Réinitialiser les données ?",
      "Profil, sauvegardes, statuts et publications seront effacés de cet appareil.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réinitialiser",
          style: "destructive",
          onPress: () => {
            reset();
            router.replace("/");
          },
        },
      ],
    );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-paper">
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className="font-black text-carbon"
          style={{ fontSize: 40, letterSpacing: -2 }}
        >
          PROFIL
        </Text>

        {/* Carte identité */}
        <View className="gap-3 rounded-3xl border-2 border-carbon bg-white p-4">
          <View className="flex-row items-center gap-4">
            <Avatar name={name} uri={profile.avatar_url} size={72} />
            <View className="flex-1">
              <Text
                className="text-xl font-black text-carbon"
                numberOfLines={2}
              >
                {name}
              </Text>
              <View className="mt-1 flex-row">
                <View className="rounded-full bg-carbon px-2.5 py-0.5">
                  <Text className="text-[11px] font-black text-white">
                    {isBiz ? ACCOUNT_LABEL.business : ROLE_LABEL[profile.role]}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {profile.bio_short ? (
            <Text className="text-[15px] leading-5 text-carbon">
              {profile.bio_short}
            </Text>
          ) : null}

          <View className="gap-1.5">
            {profile.contact_link ? (
              <View className="flex-row items-center gap-2">
                <Link2 size={15} color="#64748B" />
                <Text
                  className="flex-1 text-sm font-semibold text-slate-600"
                  numberOfLines={1}
                >
                  {profile.contact_link.replace(/^(https?:\/\/|mailto:)/, "")}
                </Text>
              </View>
            ) : null}
            {profile.country ? (
              <View className="flex-row items-center gap-2">
                <MapPin size={15} color="#64748B" />
                <Text className="text-sm font-semibold text-slate-600">
                  {profile.country}
                </Text>
              </View>
            ) : null}
          </View>

          {profile.interests.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              {profile.interests.map((c) => (
                <View
                  key={c}
                  style={{ backgroundColor: CATEGORY_STYLE[c].bg }}
                  className="rounded-full border-2 border-carbon px-3 py-1"
                >
                  <Text
                    style={{ color: CATEGORY_STYLE[c].fg }}
                    className="text-[11px] font-black"
                  >
                    {CATEGORY_STYLE[c].label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={() => router.push("/profile-edit")}
            className="flex-row items-center justify-center gap-2 rounded-full border-2 border-carbon py-3 active:opacity-80"
          >
            <Pencil size={16} color="#0F172A" strokeWidth={3} />
            <Text className="font-black text-carbon">Modifier le profil</Text>
          </Pressable>
        </View>

        {/* Quota entreprise */}
        {isBiz && (
          <View className="rounded-3xl border-2 border-carbon bg-lime p-4">
            <Text className="text-sm font-black text-carbon">
              {plan === "free"
                ? "Publications gratuites"
                : `Offre ${PLAN_NAME[plan]}`}
            </Text>
            <Text className="mt-1 text-3xl font-black text-carbon">
              {limit === Infinity
                ? `${myGems.length}`
                : `${Math.min(myGems.length, limit)}/${limit}`}
            </Text>
            <Pressable
              onPress={() => setShowPaywall(true)}
              className="mt-3 self-start rounded-full border-2 border-carbon bg-white px-4 py-2 active:opacity-80"
            >
              <Text className="text-sm font-black text-carbon">
                {plan === "free" ? "Voir les offres" : "Gérer mon offre"}
              </Text>
            </Pressable>
          </View>
        )}
        {/* Statistiques */}
        <View className="flex-row gap-2">
          <Stat value={stats.saved} label="Sauvegardés" />
          <Stat value={stats.going} label="J'y vais" />
          <Stat value={stats.alumni} label="Alumni" />
          <Stat value={stats.published} label="Publiés" />
        </View>

        {/* Mode discret */}
        <View className="flex-row items-center justify-between rounded-3xl border-2 border-carbon bg-white p-4">
          <View className="flex-1 pr-4">
            <View className="flex-row items-center gap-2">
              <EyeOff size={18} color="#0F172A" strokeWidth={3} />
              <Text className="text-base font-black text-carbon">
                Mode discret
              </Text>
            </View>
            <Text className="mt-1 text-xs leading-4 text-slate-500">
              {isIncognito
                ? "Tu n'apparais plus dans « Ils y vont » ni « Alumni ». Les autres voient seulement un compteur."
                : "Ton profil est visible dans les listes « Ils y vont » et « Alumni »."}
            </Text>
          </View>
          <Switch
            value={isIncognito}
            onValueChange={setIncognito}
            trackColor={{ false: "#CBD5E1", true: "#BEF264" }}
            thumbColor="#0F172A"
          />
        </View>

        <ReminderSettings />

        <Pressable
          onPress={() => {
            setSeenSwipeTutorial(false);
            router.navigate("/radar");
          }}
          className="items-center py-1"
        >
          <Text className="text-sm font-bold text-cobalt underline">
            Revoir le tutoriel du Radar
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setSignedIn(false);
            router.replace("/");
          }}
          className="flex-row items-center justify-center gap-2 rounded-full border-2 border-carbon bg-white py-4 active:opacity-80"
        >
          <LogOut size={18} color="#0F172A" strokeWidth={3} />
          <Text className="font-black text-carbon">Se déconnecter</Text>
        </Pressable>

        <Pressable onPress={confirmReset} className="items-center py-2">
          <Text className="text-xs font-bold text-slate-500 underline">
            Réinitialiser les données de test
          </Text>
        </Pressable>
        <PaywallModal
          visible={showPaywall}
          onClose={() => setShowPaywall(false)}
          reason="browse"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
