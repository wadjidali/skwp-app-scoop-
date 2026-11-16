import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft, Send } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { MessageBubble } from "../../components/chat/MessageBubble";
import { Avatar } from "../../components/ui/Avatar";
import { SIMULATED_DELAY_MS, pickReply } from "../../constants/chat";
import { ROLE_LABEL } from "../../constants/gems";
import { CURRENT_USER_ID, getProfile } from "../../data/mock";
import { useAppStore } from "../../store/useAppStore";
import { formatClock } from "../../utils/date";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [text, setText] = useState("");

  const conversation = useAppStore((s) =>
    s.conversations.find((c) => c.id === id),
  );
  const sendMessage = useAppStore((s) => s.sendMessage);
  const receiveMessage = useAppStore((s) => s.receiveMessage);
  const markRead = useAppStore((s) => s.markRead);

  const messageCount = conversation?.messages.length ?? 0;

  // Marque la conversation comme lue à l'ouverture et à chaque nouveau message
  useEffect(() => {
    if (id) markRead(id);
  }, [id, messageCount, markRead]);

  if (!conversation) {
    return (
      <View className="flex-1 items-center justify-center bg-paper">
        <Text className="font-bold text-carbon">Conversation introuvable.</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="font-bold text-cobalt">Retour</Text>
        </Pressable>
      </View>
    );
  }

  const peer = getProfile(conversation.peer_id);
  const peerName = peer?.full_name ?? "Membre";
  const convId = conversation.id;
  const canSend = text.trim().length > 0;

  const send = () => {
    const body = text.trim();
    if (!body) return;
    sendMessage(convId, body);
    setText("");
    // MODE DÉMO : réponse simulée de l'interlocuteur (à supprimer avec Supabase)
    setTimeout(
      () => receiveMessage(convId, pickReply(Date.now())),
      SIMULATED_DELAY_MS,
    );
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-paper">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* En-tête */}
        <View className="flex-row items-center gap-3 border-b-2 border-carbon bg-white px-4 pb-3 pt-2">
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center rounded-full border-2 border-carbon bg-white"
          >
            <ChevronLeft size={22} color="#0F172A" strokeWidth={3} />
          </Pressable>
          <Avatar name={peerName} uri={peer?.avatar_url} size={40} />
          <View className="flex-1">
            <Text
              numberOfLines={1}
              className="text-base font-black text-carbon"
            >
              {peerName}
            </Text>
            <Text
              numberOfLines={1}
              className="text-[11px] font-semibold text-slate-500"
            >
              {peer ? ROLE_LABEL[peer.role] : ""}
              {conversation.context_title
                ? ` · ${conversation.context_title}`
                : ""}
            </Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={conversation.messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          ListHeaderComponent={
            <Text className="mb-3 text-center text-[11px] text-slate-500">
              Mode démo : les réponses sont simulées.
            </Text>
          }
          renderItem={({ item }) => (
            <MessageBubble
              body={item.body}
              time={formatClock(item.created_at)}
              mine={item.sender_id === CURRENT_USER_ID}
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-6">
              <Text className="text-center text-slate-500">
                Aucun message pour l'instant. Présente-toi en une phrase.
              </Text>
            </View>
          }
        />

        {/* Suggestion de premier message */}
        {conversation.messages.length === 0 && conversation.suggestion ? (
          <Pressable
            onPress={() => setText(conversation.suggestion ?? "")}
            className="mx-4 mb-2 rounded-2xl border-2 border-dashed border-carbon bg-white p-3 active:opacity-80"
          >
            <Text className="text-[11px] font-black uppercase text-cobalt">
              Suggestion · touche pour l'utiliser
            </Text>
            <Text className="mt-1 text-sm text-carbon">
              {conversation.suggestion}
            </Text>
          </Pressable>
        ) : null}

        {/* Saisie */}
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 12) }}
          className="flex-row items-end gap-2 border-t-2 border-carbon bg-white px-4 pt-3"
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Ton message…"
            placeholderTextColor="#94A3B8"
            multiline
            maxLength={1000}
            style={{ maxHeight: 120 }}
            className="flex-1 rounded-2xl border-2 border-carbon bg-paper px-4 py-2.5 text-base text-carbon"
          />
          <Pressable
            onPress={send}
            disabled={!canSend}
            className={`h-12 w-12 items-center justify-center rounded-full border-2 border-carbon ${
              canSend ? "bg-lime active:opacity-80" : "bg-slate-200"
            }`}
          >
            <Send size={20} color="#0F172A" strokeWidth={2.5} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
