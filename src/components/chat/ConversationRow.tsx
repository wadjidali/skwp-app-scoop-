import { Pressable, Text, View } from "react-native";
import { CURRENT_USER_ID, getProfile } from "../../data/mock";
import { Conversation } from "../../types";
import { formatListTime } from "../../utils/date";
import { Avatar } from "../ui/Avatar";

type Props = { conversation: Conversation; onPress: () => void };

export function ConversationRow({ conversation, onPress }: Props) {
  const peer = getProfile(conversation.peer_id);
  const name = peer?.full_name ?? "Membre";
  const last = conversation.messages[conversation.messages.length - 1];
  const hasUnread = conversation.unread > 0;

  const preview = last
    ? last.sender_id === CURRENT_USER_ID
      ? `Toi : ${last.body}`
      : last.body
    : "Nouvelle conversation";

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center gap-3 rounded-2xl border-2 border-carbon bg-white p-3 active:opacity-80"
    >
      <Avatar name={name} uri={peer?.avatar_url} size={52} />
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text
            numberOfLines={1}
            className="flex-1 text-base font-black text-carbon"
          >
            {name}
          </Text>
          <Text className="ml-2 text-[11px] font-semibold text-slate-500">
            {formatListTime(conversation.updated_at)}
          </Text>
        </View>
        {conversation.context_title ? (
          <Text numberOfLines={1} className="text-[11px] font-bold text-cobalt">
            {conversation.context_title}
          </Text>
        ) : null}
        <View className="mt-0.5 flex-row items-center justify-between">
          <Text
            numberOfLines={1}
            className={`flex-1 text-sm ${
              hasUnread ? "font-bold text-carbon" : "text-slate-500"
            }`}
          >
            {preview}
          </Text>
          {hasUnread && (
            <View className="ml-2 h-5 min-w-[20px] items-center justify-center rounded-full bg-cobalt px-1.5">
              <Text className="text-[11px] font-black text-white">
                {conversation.unread}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
