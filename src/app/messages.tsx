import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";
import { useMemo } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConversationRow } from "../components/chat/ConversationRow";
import { useAppStore, useHydrated } from "../store/useAppStore";

export default function MessagesScreen() {
  const router = useRouter();
  const hydrated = useHydrated();
  const conversations = useAppStore((s) => s.conversations);

  const sorted = useMemo(
    () =>
      [...conversations].sort((a, b) =>
        b.updated_at.localeCompare(a.updated_at),
      ),
    [conversations],
  );

  if (!hydrated) return <View className="flex-1 bg-paper" />;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-paper">
      <StatusBar style="dark" />

      <View className="flex-row items-center gap-3 px-5 pb-3 pt-2">
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          className="h-10 w-10 items-center justify-center rounded-full border-2 border-carbon bg-white"
        >
          <ChevronLeft size={22} color="#0F172A" strokeWidth={3} />
        </Pressable>
        <Text
          className="font-black text-carbon"
          style={{ fontSize: 34, letterSpacing: -1.5 }}
        >
          MESSAGES
        </Text>
      </View>

      <Text className="px-5 pb-3 text-xs text-slate-500">
        Mode démo : les réponses sont simulées.
      </Text>

      <FlatList
        data={sorted}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ConversationRow
            conversation={item}
            onPress={() =>
              router.push({ pathname: "/chat/[id]", params: { id: item.id } })
            }
          />
        )}
        ListEmptyComponent={
          <View className="items-center rounded-3xl border-2 border-dashed border-slate-300 p-8">
            <Text className="text-center font-black text-carbon">
              Aucune conversation.
            </Text>
            <Text className="mt-1 text-center text-slate-500">
              Touche un membre dans « Ils y vont » ou « Alumni » d'un événement
              pour lui écrire.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
