import { Image } from "expo-image";
import { Text, View } from "react-native";

const PALETTE = [
  { bg: "#0038FF", fg: "#FFFFFF" },
  { bg: "#BEF264", fg: "#0F172A" },
  { bg: "#FF5C1A", fg: "#FFFFFF" },
  { bg: "#FDE68A", fg: "#0F172A" },
  { bg: "#0F172A", fg: "#FFFFFF" },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

type AvatarProps = { name: string; uri?: string | null; size?: number };

export function Avatar({ name, uri, size = 56 }: AvatarProps) {
  const color = PALETTE[name.length % PALETTE.length];
  const box = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 2,
    borderColor: "#0F172A",
  };

  if (uri) {
    return <Image source={{ uri }} style={box} contentFit="cover" />;
  }

  return (
    <View
      style={[box, { backgroundColor: color.bg }]}
      className="items-center justify-center"
    >
      <Text
        style={{ color: color.fg, fontSize: size * 0.34 }}
        className="font-black"
      >
        {initials(name)}
      </Text>
    </View>
  );
}
