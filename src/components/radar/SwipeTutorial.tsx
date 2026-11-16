import { Bookmark, Hand, X } from "lucide-react-native";
import { ReactNode, useEffect } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

function Step({
  icon,
  bg,
  title,
  text,
}: {
  icon: ReactNode;
  bg: string;
  title: string;
  text: string;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <View
        style={{ backgroundColor: bg }}
        className="h-11 w-11 items-center justify-center rounded-full border-2 border-carbon"
      >
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-base font-black text-carbon">{title}</Text>
        <Text className="text-sm text-slate-600">{text}</Text>
      </View>
    </View>
  );
}

type Props = { visible: boolean; onDone: () => void };

export function SwipeTutorial({ visible, onDone }: Props) {
  const x = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;
    x.value = withRepeat(
      withSequence(
        withTiming(46, { duration: 600 }),
        withTiming(0, { duration: 400 }),
        withTiming(-46, { duration: 600 }),
        withTiming(0, { duration: 400 }),
      ),
      -1,
      false,
    );
  }, [visible, x]);

  const demoCard = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { rotate: `${x.value * 0.25}deg` }],
  }));
  const saveHint = useAnimatedStyle(() => ({
    opacity: Math.max(0, x.value / 46),
  }));
  const skipHint = useAnimatedStyle(() => ({
    opacity: Math.max(0, -x.value / 46),
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDone}
    >
      <View
        style={{ backgroundColor: "rgba(15,23,42,0.85)" }}
        className="flex-1 items-center justify-center px-6"
      >
        <View className="w-full gap-5 rounded-3xl border-2 border-carbon bg-white p-6">
          <Text
            className="font-black text-carbon"
            style={{ fontSize: 28, lineHeight: 30, letterSpacing: -1 }}
          >
            COMMENT ÇA MARCHE
          </Text>

          {/* Démonstration animée */}
          <View className="h-28 flex-row items-center justify-between rounded-2xl bg-paper px-5">
            <Animated.View
              style={skipHint}
              className="h-12 w-12 items-center justify-center rounded-full border-2 border-carbon bg-white"
            >
              <X size={22} color="#0F172A" strokeWidth={3} />
            </Animated.View>

            <Animated.View
              style={demoCard}
              className="h-20 w-28 justify-between rounded-2xl border-2 border-carbon bg-cobalt p-2"
            >
              <View className="h-2 w-12 rounded-full bg-white" />
              <View className="h-2 w-16 rounded-full bg-lime" />
            </Animated.View>

            <Animated.View
              style={saveHint}
              className="h-12 w-12 items-center justify-center rounded-full border-2 border-carbon bg-lime"
            >
              <Bookmark size={20} color="#0F172A" strokeWidth={3} />
            </Animated.View>
          </View>

          <View className="gap-4">
            <Step
              bg="#FFFFFF"
              icon={<X size={20} color="#0F172A" strokeWidth={3} />}
              title="Glisse à gauche"
              text="Tu passes cette opportunité."
            />
            <Step
              bg="#BEF264"
              icon={<Bookmark size={19} color="#0F172A" strokeWidth={3} />}
              title="Glisse à droite"
              text="Tu la sauvegardes dans ton coffre-fort."
            />
            <Step
              bg="#0038FF"
              icon={<Hand size={19} color="#FFFFFF" strokeWidth={2.5} />}
              title="Touche la carte"
              text="Tu ouvres la fiche complète."
            />
          </View>

          <Pressable
            onPress={onDone}
            className="items-center rounded-full bg-cobalt py-4 active:opacity-80"
          >
            <Text className="text-base font-black text-white">Compris</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
