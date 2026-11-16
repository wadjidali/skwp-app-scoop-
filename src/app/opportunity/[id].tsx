import { useLocalSearchParams, useRouter } from "expo-router";
import {
    CalendarClock,
    Check,
    ExternalLink,
    MapPin,
    X,
} from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ParticipantsSection } from "../../components/opportunity/ParticipantsSection";
import { FundingBadge } from "../../components/ui/FundingBadge";
import { CATEGORY_STYLE } from "../../constants/categories";
import { MOCK_OPPORTUNITIES } from "../../data/mock";
import { useAppStore } from "../../store/useAppStore";
import { SocialStatus } from "../../types";
import { daysLeft, formatDeadline } from "../../utils/date";
import { openLink } from "../../utils/links";

export default function OpportunityDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const myStatus = useAppStore((s) => s.myStatuses[id ?? ""]);
  const toggleStatus = useAppStore((s) => s.toggleStatus);

  const item = MOCK_OPPORTUNITIES.find((o) => o.id === id);

  if (!item) {
    return (
      <View className="flex-1 items-center justify-center bg-paper">
        <Text className="font-bold text-carbon">Opportunité introuvable.</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="font-bold text-cobalt">Retour</Text>
        </Pressable>
      </View>
    );
  }

  const cat = CATEGORY_STYLE[item.category];
  const days = daysLeft(item.deadline);
  const toggle = (s: SocialStatus) => toggleStatus(item.id, s);

  return (
    <View className="flex-1 bg-paper">
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }}>
        {/* En-tête coloré */}
        <View
          style={{ backgroundColor: cat.bg, paddingTop: 28 }}
          className="px-5 pb-6"
        >
          <View className="flex-row items-center justify-between">
            <Text
              style={{ color: cat.fg }}
              className="text-xs font-black uppercase tracking-widest"
            >
              {cat.label}
            </Text>
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              className="h-10 w-10 items-center justify-center rounded-full border-2 border-carbon bg-white"
            >
              <X size={20} color="#0F172A" strokeWidth={3} />
            </Pressable>
          </View>

          <Text
            className="mt-5 font-black"
            style={{
              color: cat.fg,
              fontSize: 36,
              lineHeight: 38,
              letterSpacing: -1.5,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{ color: cat.fg }}
            className="mt-2 text-base font-bold opacity-80"
          >
            {item.organizer}
          </Text>
          <View className="mt-4 flex-row">
            <FundingBadge type={item.funding_type} />
          </View>
        </View>

        <View className="gap-6 px-5 pt-5">
          {/* Infos clés */}
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <MapPin size={18} color="#0F172A" />
              <Text className="text-base font-semibold text-carbon">
                {item.location}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <CalendarClock size={18} color="#0F172A" />
              <Text className="text-base font-semibold text-carbon">
                Deadline · {formatDeadline(item.deadline)}
              </Text>
              <View className="rounded-full bg-carbon px-2 py-0.5">
                <Text className="text-[11px] font-black text-white">
                  J-{days}
                </Text>
              </View>
            </View>
          </View>

          {/* 3 points clés */}
          <View>
            <Text className="mb-3 text-lg font-black text-carbon">
              À retenir
            </Text>
            <View className="gap-3">
              {item.summary_points.map((p, i) => (
                <View
                  key={p}
                  className="flex-row items-start gap-3 rounded-2xl border-2 border-carbon bg-white p-4"
                >
                  <View className="h-7 w-7 items-center justify-center rounded-full bg-lime">
                    <Text className="text-xs font-black text-carbon">
                      {i + 1}
                    </Text>
                  </View>
                  <Text className="flex-1 text-[15px] leading-5 text-carbon">
                    {p}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Mon statut */}
          <View>
            <Text className="mb-3 text-lg font-black text-carbon">
              Et toi ?
            </Text>
            <View className="flex-row gap-3">
              {(
                [
                  { key: "going", label: "J'y vais" },
                  { key: "alumni", label: "Je suis Alumni" },
                ] as const
              ).map((b) => {
                const active = myStatus === b.key;
                return (
                  <Pressable
                    key={b.key}
                    onPress={() => toggle(b.key)}
                    className={`flex-1 flex-row items-center justify-center gap-2 rounded-full border-2 border-carbon py-3 active:opacity-80 ${
                      active ? "bg-lime" : "bg-white"
                    }`}
                  >
                    {active && (
                      <Check size={16} color="#0F172A" strokeWidth={3} />
                    )}
                    <Text className="font-black text-carbon">{b.label}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text className="mt-2 text-xs text-slate-500">
              Visible par les autres membres, sauf si tu actives le mode discret
              (réglage dans Profil, étape 5).
            </Text>
          </View>

          {/* Preuve sociale */}
          <View>
            <Text className="mb-3 text-lg font-black text-carbon">
              Communauté
            </Text>
            <ParticipantsSection opportunityId={item.id} />
          </View>
        </View>
      </ScrollView>

      {/* Barre d'action fixe */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 left-0 right-0 border-t-2 border-carbon bg-white px-5 pt-3"
      >
        <Pressable
          onPress={() => openLink(item.apply_url)}
          className="flex-row items-center justify-center gap-2 rounded-full bg-cobalt py-4 active:opacity-80"
        >
          <Text className="text-base font-black text-white">Postuler</Text>
          <ExternalLink size={18} color="#FFFFFF" strokeWidth={3} />
        </Pressable>
      </View>
    </View>
  );
}
