import { Text, View } from "react-native";
import { FundingType } from "../../types";

const BADGE: Record<FundingType, { label: string; bg: string; fg: string }> = {
  fully_funded: { label: "Fully funded", bg: "#BEF264", fg: "#0F172A" },
  partial: { label: "Partiel", bg: "#FDE68A", fg: "#0F172A" },
  free: { label: "Gratuit", bg: "#FFFFFF", fg: "#0F172A" },
};

export function FundingBadge({ type }: { type: FundingType }) {
  const b = BADGE[type];
  return (
    <View
      style={{ backgroundColor: b.bg }}
      className="rounded-full border-2 border-carbon px-3 py-1"
    >
      <Text
        style={{ color: b.fg }}
        className="text-[11px] font-black uppercase tracking-wide"
      >
        {b.label}
      </Text>
    </View>
  );
}
