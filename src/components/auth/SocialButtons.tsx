import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export type Provider = "apple" | "google";

export function OrDivider() {
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-[2px] flex-1 bg-slate-200" />
      <Text className="text-xs font-bold uppercase text-slate-400">ou</Text>
      <View className="h-[2px] flex-1 bg-slate-200" />
    </View>
  );
}

type Props = { onPress: (provider: Provider) => void; verb?: string };

export function SocialButtons({ onPress, verb = "Continuer" }: Props) {
  return (
    <View className="gap-3">
      <Pressable
        onPress={() => onPress("apple")}
        className="flex-row items-center justify-center gap-3 rounded-full border-2 border-carbon bg-white py-3.5 active:opacity-80"
      >
        <Ionicons name="logo-apple" size={20} color="#0F172A" />
        <Text className="text-base font-black text-carbon">
          {verb} avec Apple
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onPress("google")}
        className="flex-row items-center justify-center gap-3 rounded-full border-2 border-carbon bg-white py-3.5 active:opacity-80"
      >
        <Ionicons name="logo-google" size={19} color="#0F172A" />
        <Text className="text-base font-black text-carbon">
          {verb} avec Google
        </Text>
      </Pressable>
    </View>
  );
}
