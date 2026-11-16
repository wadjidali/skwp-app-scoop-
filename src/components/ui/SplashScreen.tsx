import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, {
    Easing,
    SharedValue,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from "react-native-reanimated";

// Couleurs : modifie ici si tu veux un autre bleu (ex : "#0047FF")
const BG = "#0038FF";
const TILE_GREEN = "#39FF14";
const INK = "#0A0A0C";

const TILE = 56; // taille d'une tuile
const GAP = 12;
const SLOT = TILE + GAP; // espacement final entre les centres
const LOGO_WIDTH = SLOT * 4;

const LETTERS = [
  { letter: "S", from: "left", rot: -90 },
  { letter: "K", from: "top", rot: 180 },
  { letter: "W", from: "bottom", rot: -180 },
  { letter: "P", from: "right", rot: 90 },
] as const;

type From = (typeof LETTERS)[number]["from"];

function triggerHaptic() {
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  } catch {
    // Retour haptique indisponible (simulateur, web) : on ignore
  }
}

type TileProps = {
  letter: string;
  index: number;
  from: From;
  rot: number;
  enter: SharedValue<number>;
  lock: SharedValue<number>;
  screenW: number;
  screenH: number;
};

function Tile({
  letter,
  index,
  from,
  rot,
  enter,
  lock,
  screenW,
  screenH,
}: TileProps) {
  const style = useAnimatedStyle(() => {
    const slotX = (index - 1.5) * SLOT; // position finale
    const looseX = slotX * 1.7; // position « écartée » à l'arrivée

    const startX =
      from === "left" ? -screenW : from === "right" ? screenW : looseX;
    const startY = from === "top" ? -screenH : from === "bottom" ? screenH : 0;

    const x =
      interpolate(enter.value, [0, 1], [startX, looseX]) +
      lock.value * (slotX - looseX);
    const y = interpolate(enter.value, [0, 1], [startY, 0]);
    const angle = interpolate(enter.value, [0, 1], [rot, 0]);

    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { rotate: `${angle}deg` },
      ],
    };
  });

  return (
    <Animated.View style={[styles.tile, style]}>
      <View style={styles.tileShadow} />
      <View style={styles.tileFace}>
        <Text style={styles.tileText}>{letter}</Text>
      </View>
    </Animated.View>
  );
}

type Props = {
  /** Appelé une fois l'animation de sortie terminée. */
  onAnimationEnd: () => void;
  /** Tant que false, la sortie attend (ex : données enregistrées en cours de chargement). */
  ready?: boolean;
};

export function SplashScreen({ onAnimationEnd, ready = true }: Props) {
  const { width, height } = useWindowDimensions();
  const [introDone, setIntroDone] = useState(false);
  const exiting = useRef(false);

  const enter = useSharedValue(0);
  const lock = useSharedValue(0);
  const slogan = useSharedValue(0);
  const exit = useSharedValue(0);

  const finish = useCallback(() => onAnimationEnd(), [onAnimationEnd]);

  // Entrée, verrouillage, slogan
  useEffect(() => {
    enter.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.exp),
    });
    lock.value = withDelay(
      600,
      withSpring(1, { damping: 14, stiffness: 220, mass: 0.7 }),
    );
    slogan.value = withDelay(
      900,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) }),
    );

    const haptic = setTimeout(triggerHaptic, 720); // à l'emboîtement des tuiles
    const intro = setTimeout(() => setIntroDone(true), 1500);
    return () => {
      clearTimeout(haptic);
      clearTimeout(intro);
    };
  }, [enter, lock, slogan]);

  // Sortie : démarre quand l'intro est finie ET que l'app est prête
  useEffect(() => {
    if (!introDone || !ready || exiting.current) return;
    exiting.current = true;
    exit.value = withTiming(
      1,
      { duration: 400, easing: Easing.inOut(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(finish)();
      },
    );
  }, [introDone, ready, exit, finish]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: 1 - exit.value }));
  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -exit.value * height * 0.55 }],
  }));
  const sloganStyle = useAnimatedStyle(() => ({
    opacity: slogan.value,
    transform: [{ translateY: (1 - slogan.value) * 20 }],
  }));

  return (
    <Animated.View style={[styles.overlay, fadeStyle]}>
      <Animated.View style={[styles.content, contentStyle]}>
        <View style={styles.logo}>
          {LETTERS.map((l, i) => (
            <Tile
              key={l.letter}
              letter={l.letter}
              index={i}
              from={l.from}
              rot={l.rot}
              enter={enter}
              lock={lock}
              screenW={width}
              screenH={height}
            />
          ))}
        </View>

        <Animated.Text style={[styles.slogan, sloganStyle]}>
          Le scoop de ton avenir
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  content: { alignItems: "center", justifyContent: "center" },
  logo: { width: LOGO_WIDTH, height: TILE + 6 },
  tile: {
    position: "absolute",
    left: (LOGO_WIDTH - TILE) / 2,
    top: 0,
    width: TILE,
    height: TILE,
  },
  tileShadow: {
    position: "absolute",
    top: 5,
    left: 5,
    width: TILE,
    height: TILE,
    borderRadius: 14,
    backgroundColor: INK,
  },
  tileFace: {
    width: TILE,
    height: TILE,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: INK,
    backgroundColor: TILE_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  tileText: { color: INK, fontSize: 30, fontWeight: "900" },
  slogan: {
    marginTop: 44,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
});
