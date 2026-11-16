import { Text, View } from "react-native";

type Props = { data: number[]; labels: string[] };

export function TrendChart({ data, labels }: Props) {
  const max = Math.max(...data, 1);

  return (
    <View className="rounded-3xl border-2 border-carbon bg-white p-4">
      <Text className="text-base font-black text-carbon">Vues sur 7 jours</Text>

      <View className="mt-4 h-32 flex-row items-end justify-between gap-2">
        {data.map((v, i) => (
          <View key={i} className="flex-1 items-center justify-end">
            <Text className="mb-1 text-[10px] font-bold text-slate-500">
              {v}
            </Text>
            <View
              style={{ height: Math.max(4, (v / max) * 88) }}
              className={`w-full rounded-md border-2 border-carbon ${
                i === data.length - 1 ? "bg-lime" : "bg-cobalt"
              }`}
            />
          </View>
        ))}
      </View>

      <View className="mt-2 flex-row justify-between gap-2">
        {labels.map((l, i) => (
          <Text
            key={i}
            className="flex-1 text-center text-[10px] font-semibold text-slate-500"
          >
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}
