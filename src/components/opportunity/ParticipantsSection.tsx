import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { ROLE_LABEL } from "../../constants/gems";
import {
  CURRENT_USER_ID,
  MOCK_OPPORTUNITIES,
  getParticipants,
} from "../../data/mock";
import { useAppStore } from "../../store/useAppStore";
import { Profile, SocialStatus } from "../../types";
import { openLink } from "../../utils/links";
import { displayName } from "../../utils/profile";
import { Avatar } from "../ui/Avatar";

const TABS: { key: SocialStatus; label: string }[] = [
  { key: "going", label: "Ils y vont" },
  { key: "alumni", label: "Alumni" },
];

export function ParticipantsSection({
  opportunityId,
}: {
  opportunityId: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<SocialStatus>("going");

  const myStatus = useAppStore((s) => s.myStatuses[opportunityId]);
  const isIncognito = useAppStore((s) => s.isIncognito);
  const myProfile = useAppStore((s) => s.profile);
  const startConversation = useAppStore((s) => s.startConversation);

  const eventTitle =
    MOCK_OPPORTUNITIES.find((o) => o.id === opportunityId)?.title ??
    "cet événement";

  const base = getParticipants(opportunityId, tab);
  const isMineHere = myStatus === tab;

  const me: Profile = {
    id: CURRENT_USER_ID,
    full_name: displayName(myProfile),
    avatar_url: myProfile.avatar_url,
    role: myProfile.role,
    bio_short: myProfile.bio_short,
    contact_link: "",
    is_incognito: false,
  };

  const visible =
    isMineHere && !isIncognito ? [me, ...base.visible] : base.visible;
  const hiddenCount = base.hiddenCount + (isMineHere && isIncognito ? 1 : 0);

  const openChat = (p: Profile) => {
    const first = p.full_name.split(" ")[0];
    const suggestion =
      tab === "alumni"
        ? `Salut ${first}, j'ai vu que tu avais participé à ${eventTitle}. Comment s'est passée ta candidature ?`
        : `Salut ${first}, moi aussi je prépare ma venue à ${eventTitle}. On s'organise ensemble ?`;
    const convId = startConversation(p.id, { title: eventTitle, suggestion });
    router.push({ pathname: "/chat/[id]", params: { id: convId } });
  };

  const handlePress = (p: Profile) => {
    if (p.id === CURRENT_USER_ID) {
      Alert.alert(
        "C'est toi",
        "Les autres membres te voient ici. Active le mode discret dans Profil pour te masquer.",
      );
      return;
    }
    Alert.alert(
      `${p.full_name} · ${ROLE_LABEL[p.role]}`,
      p.bio_short || undefined,
      [
        { text: "Annuler", style: "cancel" },
        ...(p.contact_link
          ? [
              {
                text: "Ouvrir son lien",
                onPress: () => openLink(p.contact_link),
              },
            ]
          : []),
        { text: "Discuter", onPress: () => openChat(p) },
      ],
    );
  };

  return (
    <View>
      <View className="flex-row gap-2">
        {TABS.map((t) => {
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

      {visible.length === 0 && hiddenCount === 0 ? (
        <Text className="mt-4 text-slate-500">
          {tab === "going"
            ? "Personne pour l'instant. Sois le premier à t'y inscrire."
            : "Aucun alumni pour cet événement."}
        </Text>
      ) : (
        <FlatList
          className="mt-4"
          data={visible}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ gap: 16 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handlePress(item)}
              className="w-[72px] items-center active:opacity-70"
            >
              <Avatar name={item.full_name} uri={item.avatar_url} size={60} />
              <Text
                numberOfLines={1}
                className="mt-1 text-xs font-bold text-carbon"
              >
                {item.full_name.split(" ")[0]}
              </Text>
              <Text className="text-[10px] font-semibold text-slate-500">
                {ROLE_LABEL[item.role]}
              </Text>
            </Pressable>
          )}
          ListFooterComponent={
            hiddenCount > 0 ? (
              <View className="w-[72px] items-center">
                <View className="h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-dashed border-slate-400">
                  <Text className="font-black text-slate-500">
                    +{hiddenCount}
                  </Text>
                </View>
                <Text className="mt-1 text-[10px] font-semibold text-slate-500">
                  discret{hiddenCount > 1 ? "s" : ""}
                </Text>
              </View>
            ) : undefined
          }
        />
      )}
    </View>
  );
}
