import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function Placeholder({ title, hint }: { title: string; hint: string }) {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-paper">
      <View className="flex-1 px-5 pt-4">
        <Text
          className="font-black text-carbon"
          style={{ fontSize: 40, letterSpacing: -2 }}
        >
          {title}
        </Text>
        <Text className="mt-2 text-base text-slate-500">{hint}</Text>
      </View>
    </SafeAreaView>
  );
}
