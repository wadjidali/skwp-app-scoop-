import { X } from "lucide-react-native";
import { ReactNode } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { CATEGORY_STYLE } from "../../constants/categories";
import { FUNDING_OPTIONS, PLACE_OPTIONS } from "../../constants/filters";
import { useAppStore } from "../../store/useAppStore";
import { Category, RadarFilters } from "../../types";
import { DEFAULT_FILTERS, toggleIn } from "../../utils/opportunities";
import { Chip } from "../ui/Chip";

const CATEGORIES = Object.keys(CATEGORY_STYLE) as Category[];

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-black text-carbon">{title}</Text>
        {action}
      </View>
      <View className="flex-row flex-wrap gap-2">{children}</View>
    </View>
  );
}

type Props = {
  visible: boolean;
  onClose: () => void;
  value: RadarFilters;
  onChange: (f: RadarFilters) => void;
  countries: string[];
  resultCount: number;
};

export function RadarFiltersModal({
  visible,
  onClose,
  value,
  onChange,
  countries,
  resultCount,
}: Props) {
  const interests = useAppStore((s) => s.profile.interests);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-paper">
        <View className="flex-row items-center justify-between px-5 pb-3 pt-5">
          <Text
            className="font-black text-carbon"
            style={{ fontSize: 30, letterSpacing: -1.5 }}
          >
            FILTRES
          </Text>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center rounded-full border-2 border-carbon bg-white"
          >
            <X size={20} color="#0F172A" strokeWidth={3} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 30, gap: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <Section title="Lieu">
            {PLACE_OPTIONS.map((o) => (
              <Chip
                key={o.key}
                variant="dark"
                label={o.label}
                active={value.place === o.key}
                onPress={() =>
                  onChange({
                    ...value,
                    place: o.key,
                    countries: o.key === "online" ? [] : value.countries,
                  })
                }
              />
            ))}
          </Section>

          <Section title="Financement">
            {FUNDING_OPTIONS.map((o) => (
              <Chip
                key={o.key}
                label={o.label}
                active={value.funding.includes(o.key)}
                onPress={() =>
                  onChange({
                    ...value,
                    funding: toggleIn(value.funding, o.key),
                  })
                }
              />
            ))}
          </Section>

          <Section
            title="Catégories"
            action={
              interests.length > 0 ? (
                <Pressable
                  onPress={() => onChange({ ...value, categories: interests })}
                >
                  <Text className="text-xs font-bold text-cobalt underline">
                    Utiliser mes intérêts
                  </Text>
                </Pressable>
              ) : undefined
            }
          >
            {CATEGORIES.map((c) => (
              <Chip
                key={c}
                label={CATEGORY_STYLE[c].label}
                active={value.categories.includes(c)}
                onPress={() =>
                  onChange({
                    ...value,
                    categories: toggleIn(value.categories, c),
                  })
                }
              />
            ))}
          </Section>

          {value.place !== "online" && countries.length > 0 && (
            <Section title="Pays (présentiel)">
              {countries.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  active={value.countries.includes(c)}
                  onPress={() =>
                    onChange({
                      ...value,
                      countries: toggleIn(value.countries, c),
                    })
                  }
                />
              ))}
            </Section>
          )}
        </ScrollView>

        {/* Barre d'action */}
        <View className="flex-row items-center gap-3 border-t-2 border-carbon bg-white px-5 pb-8 pt-3">
          <Pressable
            onPress={() => onChange(DEFAULT_FILTERS)}
            className="rounded-full border-2 border-carbon px-5 py-3.5 active:opacity-80"
          >
            <Text className="font-black text-carbon">Réinitialiser</Text>
          </Pressable>
          <Pressable
            onPress={onClose}
            disabled={resultCount === 0}
            className={`flex-1 items-center rounded-full py-3.5 ${
              resultCount === 0 ? "bg-slate-300" : "bg-cobalt active:opacity-80"
            }`}
          >
            <Text
              className={`font-black ${
                resultCount === 0 ? "text-slate-600" : "text-white"
              }`}
            >
              {resultCount === 0
                ? "Aucun résultat"
                : `Voir ${resultCount} résultat${resultCount > 1 ? "s" : ""}`}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
