import { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  label: string;
  value: number | string;
  icon: ReactNode;
  bg: string;
};

export function KpiCard({ label, value, icon, bg }: Props) {
  return (
    <View
      style={{ backgroundColor: bg, width: "48.5%" }}
      className="mb-3 rounded-2xl border-2 border-carbon p-3"
    >
      <View className="h-8 w-8 items-center justify-center rounded-full border-2 border-carbon bg-white">
        {icon}
      </View>
      <Text
        className="mt-2 font-black text-carbon"
        style={{ fontSize: 28, letterSpacing: -1 }}
      >
        {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
      </Text>
      <Text className="text-xs font-bold text-carbon">{label}</Text>
    </View>
  );
}
