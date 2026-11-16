import { Text, View } from "react-native";

type Props = { body: string; time: string; mine: boolean };

export function MessageBubble({ body, time, mine }: Props) {
  return (
    <View className={`mb-2 max-w-[80%] ${mine ? "self-end" : "self-start"}`}>
      <View
        className={`rounded-2xl border-2 border-carbon px-4 py-2.5 ${
          mine ? "rounded-br-md bg-lime" : "rounded-bl-md bg-white"
        }`}
      >
        <Text className="text-[15px] leading-5 text-carbon">{body}</Text>
      </View>
      <Text
        className={`mt-0.5 text-[10px] text-slate-500 ${
          mine ? "text-right" : "text-left"
        }`}
      >
        {time}
      </Text>
    </View>
  );
}
