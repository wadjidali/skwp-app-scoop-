import { Bookmark, X } from "lucide-react-native";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Opportunity, SwipeDirection } from "../../types";
import { OpportunityCard } from "./OpportunityCard";

const SCREEN_W = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_W * 0.3;
const OUT_DISTANCE = SCREEN_W * 1.5;

type CardHandle = { swipe: (dir: SwipeDirection) => void };

/* ---------- Carte du dessus (interactive) ---------- */
type TopCardProps = {
  item: Opportunity;
  dragX: SharedValue<number>;
  onSwiped: (item: Opportunity, dir: SwipeDirection) => void;
  onOpen: (item: Opportunity) => void;
};

const TopCard = forwardRef<CardHandle, TopCardProps>(
  ({ item, dragX, onSwiped, onOpen }, ref) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const flying = useSharedValue(false);

    const flyOut = (dir: SwipeDirection) => {
      "worklet";
      if (flying.value) return;
      flying.value = true;
      const target = dir === "right" ? OUT_DISTANCE : -OUT_DISTANCE;
      dragX.value = withTiming(target, { duration: 240 });
      translateX.value = withTiming(target, { duration: 240 }, (finished) => {
        if (finished) runOnJS(onSwiped)(item, dir);
      });
    };

    // Permet aux boutons ✕ / ✓ de déclencher le swipe
    useImperativeHandle(ref, () => ({ swipe: (dir) => flyOut(dir) }));

    const pan = Gesture.Pan()
      .activeOffsetX([-8, 8])
      .onUpdate((e) => {
        if (flying.value) return;
        translateX.value = e.translationX;
        translateY.value = e.translationY * 0.25;
        dragX.value = e.translationX;
      })
      .onEnd((e) => {
        if (flying.value) return;
        const farEnough = Math.abs(e.translationX) > SWIPE_THRESHOLD;
        const fastEnough = Math.abs(e.velocityX) > 900;
        if (farEnough || fastEnough) {
          flyOut(e.translationX >= 0 ? "right" : "left");
        } else {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          dragX.value = withSpring(0);
        }
      });

    const tap = Gesture.Tap()
      .maxDistance(10)
      .onEnd((_e, success) => {
        if (success && !flying.value) runOnJS(onOpen)(item);
      });

    const gesture = Gesture.Race(pan, tap);

    const cardStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        {
          rotate: `${interpolate(
            translateX.value,
            [-SCREEN_W, 0, SCREEN_W],
            [-12, 0, 12],
            Extrapolation.CLAMP,
          )}deg`,
        },
      ],
    }));

    const saveStamp = useAnimatedStyle(() => ({
      opacity: interpolate(
        translateX.value,
        [0, SWIPE_THRESHOLD],
        [0, 1],
        Extrapolation.CLAMP,
      ),
    }));
    const skipStamp = useAnimatedStyle(() => ({
      opacity: interpolate(
        translateX.value,
        [-SWIPE_THRESHOLD, 0],
        [1, 0],
        Extrapolation.CLAMP,
      ),
    }));

    // Icônes de confirmation : grossissent à l'approche du seuil
    const saveIcon = useAnimatedStyle(() => ({
      opacity: interpolate(
        translateX.value,
        [20, SWIPE_THRESHOLD],
        [0, 1],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            translateX.value,
            [20, SWIPE_THRESHOLD],
            [0.6, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }));
    const skipIcon = useAnimatedStyle(() => ({
      opacity: interpolate(
        translateX.value,
        [-SWIPE_THRESHOLD, -20],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD, -20],
            [1, 0.6],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }));

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[StyleSheet.absoluteFill, cardStyle]}>
          <OpportunityCard item={item} />

          {/* Icônes de confirmation */}
          <Animated.View
            pointerEvents="none"
            style={[styles.badge, styles.badgeSave, saveIcon]}
          >
            <Bookmark size={44} color="#0F172A" strokeWidth={3} />
          </Animated.View>
          <Animated.View
            pointerEvents="none"
            style={[styles.badge, styles.badgeSkip, skipIcon]}
          >
            <X size={46} color="#0F172A" strokeWidth={3} />
          </Animated.View>

          {/* Tampons de swipe */}
          <Animated.View
            pointerEvents="none"
            style={[styles.stamp, styles.stampSave, saveStamp]}
          >
            <Text style={[styles.stampText, { color: "#0F172A" }]}>
              SAUVEGARDER
            </Text>
          </Animated.View>
          <Animated.View
            pointerEvents="none"
            style={[styles.stamp, styles.stampSkip, skipStamp]}
          >
            <Text style={[styles.stampText, { color: "#FFFFFF" }]}>PASSER</Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  },
);
TopCard.displayName = "TopCard";

/* ---------- Carte du dessous (statique, grossit pendant le drag) ---------- */
function NextCard({
  item,
  dragX,
}: {
  item: Opportunity;
  dragX: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          Math.abs(dragX.value),
          [0, SCREEN_W * 0.5],
          [0.94, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <OpportunityCard item={item} />
    </Animated.View>
  );
}

/* ---------- Deck ---------- */
export type SwipeDeckHandle = { swipe: (dir: SwipeDirection) => void };

type SwipeDeckProps = {
  data: Opportunity[];
  onSave: (item: Opportunity) => void;
  onSkip: (item: Opportunity) => void;
  onOpen: (item: Opportunity) => void;
};

export const SwipeDeck = forwardRef<SwipeDeckHandle, SwipeDeckProps>(
  ({ data, onSave, onSkip, onOpen }, ref) => {
    const [index, setIndex] = useState(0);
    const dragX = useSharedValue(0);
    const topRef = useRef<CardHandle>(null);

    useImperativeHandle(ref, () => ({
      swipe: (dir) => topRef.current?.swipe(dir),
    }));

    const handleSwiped = useCallback(
      (item: Opportunity, dir: SwipeDirection) => {
        dragX.value = 0;
        setIndex((i) => i + 1);
        if (dir === "right") onSave(item);
        else onSkip(item);
      },
      [dragX, onSave, onSkip],
    );

    const top = data[index];
    const next = data[index + 1];

    if (!top) {
      return (
        <View className="flex-1 items-center justify-center rounded-[32px] border-2 border-dashed border-slate-300 p-6">
          <Text
            className="text-center font-black text-carbon"
            style={{ fontSize: 28, letterSpacing: -1 }}
          >
            Tu as tout vu.
          </Text>
          <Text className="mt-2 text-center text-slate-500">
            Reviens demain pour de nouvelles opportunités.
          </Text>
          <Pressable
            onPress={() => setIndex(0)}
            className="mt-5 rounded-full bg-carbon px-6 py-3 active:opacity-80"
          >
            <Text className="font-bold text-white">Revoir le deck</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        {next && <NextCard key={next.id} item={next} dragX={dragX} />}
        <TopCard
          key={top.id}
          ref={topRef}
          item={top}
          dragX={dragX}
          onSwiped={handleSwiped}
          onOpen={onOpen}
        />
      </View>
    );
  },
);
SwipeDeck.displayName = "SwipeDeck";

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: "36%",
    left: "50%",
    marginLeft: -48,
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeSave: { backgroundColor: "#BEF264" },
  badgeSkip: { backgroundColor: "#FFFFFF" },
  stamp: {
    position: "absolute",
    top: 28,
    borderWidth: 3,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  stampSave: {
    left: 20,
    backgroundColor: "#BEF264",
    borderColor: "#0F172A",
    transform: [{ rotate: "-12deg" }],
  },
  stampSkip: {
    right: 20,
    backgroundColor: "#0F172A",
    borderColor: "#FFFFFF",
    transform: [{ rotate: "12deg" }],
  },
  stampText: { fontWeight: "900", fontSize: 18, letterSpacing: 1 },
});
