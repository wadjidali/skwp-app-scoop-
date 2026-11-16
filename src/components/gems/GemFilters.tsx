import { Pressable, ScrollView, Text, View } from "react-native";
import { GEM_FILTERS } from "../../constants/gems";
import { GemFilter } from "../../types";

type Props = { value: GemFilter; onChange: (f: GemFilter) => void };

export function GemFilters({ value, onChange }: Props) {
  return (
    // Hauteur fixe : la liste en dessous ne peut plus écraser les pastilles
    <View style={{ height: 52 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 8,
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        {GEM_FILTERS.map((f) => {
          const active = value === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => onChange(f.key)}
              style={{ height: 40 }}
              className={`items-center justify-center rounded-full border-2 border-carbon px-4 ${
                active ? "bg-carbon" : "bg-white"
              }`}
            >
              <Text
                className={`text-sm font-black ${
                  active ? "text-white" : "text-carbon"
                }`}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
