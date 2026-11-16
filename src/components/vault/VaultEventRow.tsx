import { MapPin, Trash2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { CATEGORY_STYLE } from "../../constants/categories";
import { Opportunity, SocialStatus } from "../../types";
import { daysLeft, formatDeadline, isExpired } from "../../utils/date";

const STATUS_LABEL: Record<SocialStatus, string> = {
  going: "J'y vais",
  alumni: "Alumni",
};

type Props = {
  item: Opportunity;
  status?: SocialStatus;
  onOpen: () => void;
  onRemove: () => void;
};

export function VaultEventRow({ item, status, onOpen, onRemove }: Props) {
  const cat = CATEGORY_STYLE[item.category];
  const expired = isExpired(item.deadline);
  const days = daysLeft(item.deadline);

  // Alerte visuelle : orange à moins de 7 jours, gris une fois expiré
  const urgency = expired
    ? { bg: "#E2E8F0", fg: "#0F172A", label: "Expiré" }
    : days <= 7
      ? { bg: "#FF5C1A", fg: "#FFFFFF", label: `J-${days}` }
      : { bg: "#0F172A", fg: "#FFFFFF", label: `J-${days}` };

  return (
    <Pressable
      onPress={onOpen}
      className="mb-3 flex-row overflow-hidden rounded-2xl border-2 border-carbon bg-white active:opacity-80"
    >
      <View style={{ width: 10, backgroundColor: cat.bg }} />
      <View className="flex-1 p-3">
        <View className="flex-row items-start justify-between gap-2">
          <Text
            className="flex-1 text-base font-black text-carbon"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Pressable onPress={onRemove} hitSlop={12}>
            <Trash2 size={18} color="#64748B" />
          </Pressable>
        </View>

        <View className="mt-1 flex-row items-center gap-1">
          <MapPin size={13} color="#64748B" />
          <Text className="text-xs font-semibold text-slate-500">
            {item.location}
          </Text>
        </View>

        <View className="mt-2 flex-row items-center gap-2">
          <View
            style={{ backgroundColor: urgency.bg }}
            className="rounded-full px-2.5 py-1"
          >
            <Text
              style={{ color: urgency.fg }}
              className="text-[11px] font-black"
            >
              {urgency.label}
            </Text>
          </View>
          <Text className="text-xs font-semibold text-carbon">
            {formatDeadline(item.deadline)}
          </Text>
          {status && (
            <View className="rounded-full border-2 border-carbon bg-lime px-2 py-0.5">
              <Text className="text-[10px] font-black text-carbon">
                {STATUS_LABEL[status]}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
