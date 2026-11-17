import { Text, View } from "react-native";

const INK = "#0A0A0C";
const GREEN = "#39FF14";
const LETTERS = ["S", "K", "W", "P"];

/** Logo SKWP : quatre tuiles vertes à ombre décalée, comme sur le splash. */
export function Logo({ size = 44 }: { size?: number }) {
  const gap = Math.round(size * 0.2);
  const radius = Math.round(size * 0.25);
  const shadow = Math.max(3, Math.round(size * 0.09));
  const border = Math.max(2, Math.round(size * 0.055));

  return (
    <View style={{ flexDirection: "row", gap }}>
      {LETTERS.map((letter) => (
        <View
          key={letter}
          style={{ width: size + shadow, height: size + shadow }}
        >
          <View
            style={{
              position: "absolute",
              top: shadow,
              left: shadow,
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: INK,
            }}
          />
          <View
            style={{
              width: size,
              height: size,
              borderRadius: radius,
              borderWidth: border,
              borderColor: INK,
              backgroundColor: GREEN,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ color: INK, fontSize: size * 0.54, fontWeight: "900" }}
            >
              {letter}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
