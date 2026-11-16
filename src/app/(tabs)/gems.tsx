import { useRouter } from "expo-router";
import { MessageCircle, Plus } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateGemModal } from "../../components/gems/CreateGemModal";
import { GemCard } from "../../components/gems/GemCard";
import { GemFilters } from "../../components/gems/GemFilters";
import { PaywallModal } from "../../components/premium/PaywallModal";
import { SearchBar } from "../../components/ui/SearchBar";
import { getPostLimit, quotaLabel } from "../../constants/plans";
import { CURRENT_USER_ID, MOCK_GEMS, getProfile } from "../../data/mock";
import { useAppStore } from "../../store/useAppStore";
import { Gem, GemFilter } from "../../types";
import { displayName } from "../../utils/profile";
import { gemMatches } from "../../utils/search";

export default function GemsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<GemFilter>("all");
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const myGems = useAppStore((s) => s.myGems);
  const savedGemIds = useAppStore((s) => s.savedGemIds);
  const profile = useAppStore((s) => s.profile);
  const plan = useAppStore((s) => s.plan);
  const toggleSaveGem = useAppStore((s) => s.toggleSaveGem);
  const addGem = useAppStore((s) => s.addGem);
  const unreadTotal = useAppStore((s) =>
    s.conversations.reduce((n, c) => n + c.unread, 0),
  );

  const isBiz = profile.account_type === "business";
  const quotaReached = isBiz && myGems.length >= getPostLimit(plan);
  const searching = query.trim().length > 0;

  const data = useMemo(() => {
    const authorOf = (g: Gem) =>
      g.author_id === CURRENT_USER_ID
        ? displayName(profile)
        : (getProfile(g.author_id)?.full_name ?? "");

    return [...myGems, ...MOCK_GEMS]
      .filter((g) => filter === "all" || g.type === filter)
      .filter((g) => gemMatches(g, query, authorOf(g)));
  }, [myGems, filter, query, profile]);

  const openCreate = () => {
    if (quotaReached) setShowPaywall(true);
    else setShowCreate(true);
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-paper">
      <View className="flex-row items-center justify-between px-5 pb-3 pt-2">
        <View className="flex-1 pr-3">
          <Text
            className="font-black text-carbon"
            style={{ fontSize: 40, letterSpacing: -2 }}
          >
            PÉPITES
          </Text>
          <Text className="text-sm font-semibold text-slate-500">
            {isBiz
              ? quotaLabel(plan, myGems.length)
              : `${savedGemIds.length} sauvegardée${savedGemIds.length > 1 ? "s" : ""}`}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/messages")}
          className="h-12 w-12 items-center justify-center rounded-full border-2 border-carbon bg-white active:opacity-70"
        >
          <MessageCircle size={22} color="#0F172A" strokeWidth={2.5} />
          {unreadTotal > 0 && (
            <View className="absolute -right-1 -top-1 h-5 min-w-[20px] items-center justify-center rounded-full bg-cobalt px-1">
              <Text className="text-[11px] font-black text-white">
                {unreadTotal}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Rechercher une pépite, un profil…"
      />

      <GemFilters value={filter} onChange={setFilter} />

      <FlatList
        className="mt-4"
        data={data}
        keyExtractor={(g) => g.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <GemCard
            gem={item}
            saved={savedGemIds.includes(item.id)}
            onToggleSave={toggleSaveGem}
          />
        )}
        ListEmptyComponent={
          <View className="items-center rounded-3xl border-2 border-dashed border-slate-300 p-8">
            <Text className="text-center font-black text-carbon">
              {searching ? "Aucun résultat." : "Rien ici pour l'instant."}
            </Text>
            <Text className="mt-1 text-center text-slate-500">
              {searching
                ? `Rien ne correspond à « ${query.trim()} ». Essaie un autre mot ou change de filtre.`
                : "Sois le premier à partager une pépite de ce type."}
            </Text>
          </View>
        }
      />

      <Pressable
        onPress={openCreate}
        className="absolute bottom-5 right-5 h-16 w-16 items-center justify-center rounded-full border-2 border-carbon bg-lime active:opacity-80"
      >
        <Plus size={30} color="#0F172A" strokeWidth={3} />
      </Pressable>

      <CreateGemModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={(gem) => {
          addGem(gem);
          setFilter("all");
          setQuery("");
        }}
      />

      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        reason="quota"
      />
    </SafeAreaView>
  );
}
