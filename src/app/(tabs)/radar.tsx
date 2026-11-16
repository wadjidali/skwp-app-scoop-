import { useRouter } from "expo-router";
import { Bookmark, SlidersHorizontal, X } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RadarFiltersModal } from "../../components/radar/RadarFiltersModal";
import { SwipeDeck, SwipeDeckHandle } from "../../components/radar/SwipeDeck";
import { SwipeTutorial } from "../../components/radar/SwipeTutorial";
import { MOCK_OPPORTUNITIES } from "../../data/mock";
import { useAppStore, useHydrated } from "../../store/useAppStore";
import { Opportunity, RadarFilters } from "../../types";
import {
  DEFAULT_FILTERS,
  activeFilterCount,
  applyFilters,
  availableCountries,
} from "../../utils/opportunities";

export default function RadarScreen() {
  const router = useRouter();
  const hydrated = useHydrated();
  const deckRef = useRef<SwipeDeckHandle>(null);
  const [filters, setFilters] = useState<RadarFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const savedCount = useAppStore((s) => s.savedOpportunityIds.length);
  const saveOpportunity = useAppStore((s) => s.saveOpportunity);
  const seenTutorial = useAppStore((s) => s.seenSwipeTutorial);
  const setSeenTutorial = useAppStore((s) => s.setSeenSwipeTutorial);

  const results = useMemo(
    () => applyFilters(MOCK_OPPORTUNITIES, filters),
    [filters],
  );
  const countries = useMemo(() => availableCountries(MOCK_OPPORTUNITIES), []);
  const active = activeFilterCount(filters);

  const handleSave = useCallback(
    (item: Opportunity) => saveOpportunity(item.id),
    [saveOpportunity],
  );
  const handleSkip = useCallback((_item: Opportunity) => {}, []);
  const handleOpen = useCallback(
    (item: Opportunity) => {
      router.push({ pathname: "/opportunity/[id]", params: { id: item.id } });
    },
    [router],
  );
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-paper">
      <View className="flex-row items-center justify-between px-5 pb-3 pt-2">
        <View>
          <Text
            className="font-black text-carbon"
            style={{ fontSize: 40, letterSpacing: -2 }}
          >
            RADAR
          </Text>
          <Text className="text-sm font-semibold text-slate-500">
            {savedCount} sauvegardée{savedCount > 1 ? "s" : ""}
          </Text>
        </View>

        <Pressable
          onPress={() => setShowFilters(true)}
          className="h-12 w-12 items-center justify-center rounded-full border-2 border-carbon bg-white active:opacity-70"
        >
          <SlidersHorizontal size={22} color="#0F172A" strokeWidth={2.5} />
          {active > 0 && (
            <View className="absolute -right-1 -top-1 h-5 min-w-[20px] items-center justify-center rounded-full bg-cobalt px-1">
              <Text className="text-[11px] font-black text-white">
                {active}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {active > 0 && (
        <View className="flex-row items-center gap-3 px-5 pb-2">
          <Text className="text-sm font-bold text-carbon">
            {results.length} résultat{results.length > 1 ? "s" : ""}
          </Text>
          <Pressable onPress={resetFilters}>
            <Text className="text-sm font-bold text-cobalt underline">
              Réinitialiser
            </Text>
          </Pressable>
        </View>
      )}

      <View className="flex-1 px-5">
        {results.length === 0 ? (
          <View className="flex-1 items-center justify-center rounded-[32px] border-2 border-dashed border-slate-300 p-6">
            <Text
              className="text-center font-black text-carbon"
              style={{ fontSize: 28, letterSpacing: -1 }}
            >
              Aucun résultat.
            </Text>
            <Text className="mt-2 text-center text-slate-500">
              Aucune opportunité ne correspond à ces filtres.
            </Text>
            <Pressable
              onPress={resetFilters}
              className="mt-5 rounded-full bg-carbon px-6 py-3 active:opacity-80"
            >
              <Text className="font-bold text-white">
                Réinitialiser les filtres
              </Text>
            </Pressable>
          </View>
        ) : (
          <SwipeDeck
            key={JSON.stringify(filters)}
            ref={deckRef}
            data={results}
            onSave={handleSave}
            onSkip={handleSkip}
            onOpen={handleOpen}
          />
        )}
      </View>

      {results.length > 0 && (
        <View className="flex-row items-center justify-center gap-6 py-5">
          <Pressable
            onPress={() => deckRef.current?.swipe("left")}
            className="h-16 w-16 items-center justify-center rounded-full border-2 border-carbon bg-white active:opacity-70"
          >
            <X size={28} color="#0F172A" strokeWidth={3} />
          </Pressable>
          <Pressable
            onPress={() => deckRef.current?.swipe("right")}
            className="h-16 w-16 items-center justify-center rounded-full border-2 border-carbon bg-lime active:opacity-70"
          >
            <Bookmark size={26} color="#0F172A" strokeWidth={3} />
          </Pressable>
        </View>
      )}

      <RadarFiltersModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        value={filters}
        onChange={setFilters}
        countries={countries}
        resultCount={results.length}
      />

      <SwipeTutorial
        visible={hydrated && !seenTutorial && results.length > 0}
        onDone={() => setSeenTutorial(true)}
      />
    </SafeAreaView>
  );
}
