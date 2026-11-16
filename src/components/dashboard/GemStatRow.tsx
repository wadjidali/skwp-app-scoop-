import { Text, View } from "react-native";
import { GEM_TYPE_STYLE } from "../../constants/gems";
import { Gem, GemType } from "../../types";
import { GemStats } from "../../utils/stats";

const CONVERSION_LABEL: Record<GemType, string> = {
  training: "Inscriptions",
  resource: "Ouvertures",
  project: "Alliés",
};

function Mini({ value, label }: { value: number; label: string }) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-lg font-black text-carbon">
        {value.toLocaleString("fr-FR")}
      </Text>
      <Text className="text-[10px] font-bold text-slate-500">{label}</Text>
    </View>
  );
}

export function GemStatRow({ gem, stats }: { gem: Gem; stats: GemStats }) {
  const style = GEM_TYPE_STYLE[gem.type];

  return (
    <View className="mb-3 rounded-2xl border-2 border-carbon bg-white p-3">
      <View className="flex-row items-center gap-2">
        <View
          style={{ backgroundColor: style.bg }}
          className="rounded-full border-2 border-carbon px-2.5 py-0.5"
        >
          <Text
            style={{ color: style.fg }}
            className="text-[10px] font-black uppercase"
          >
            {style.label}
          </Text>
        </View>
        <Text
          numberOfLines={2}
          className="flex-1 text-sm font-black text-carbon"
        >
          {gem.title}
        </Text>
      </View>

      <View className="mt-3 flex-row">
        <Mini value={stats.views} label="Vues" />
        <Mini value={stats.clicks} label="Clics" />
        <Mini value={stats.conversions} label={CONVERSION_LABEL[gem.type]} />
      </View>
    </View>
  );
}
