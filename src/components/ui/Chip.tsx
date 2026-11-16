import { Check } from "lucide-react-native";
import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  variant?: "dark" | "lime";
};

export function Chip({ label, active, onPress, variant = "lime" }: Props) {
  const dark = variant === "dark";
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-1 rounded-full border-2 border-carbon px-4 py-2 ${
        active ? (dark ? "bg-carbon" : "bg-lime") : "bg-white"
      }`}
    >
      {active && !dark && <Check size={14} color="#0F172A" strokeWidth={3} />}
      <Text
        className={`text-sm font-black ${
          active && dark ? "text-white" : "text-carbon"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
