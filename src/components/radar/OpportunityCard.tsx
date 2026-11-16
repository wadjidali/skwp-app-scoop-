import { CalendarClock, MapPin } from "lucide-react-native";
import { Text, View } from "react-native";
import { CATEGORY_STYLE } from "../../constants/categories";
import { Opportunity } from "../../types";
import { daysLeft, formatDeadline } from "../../utils/date";
import { FundingBadge } from "../ui/FundingBadge";

export function OpportunityCard({ item }: { item: Opportunity }) {
  const cat = CATEGORY_STYLE[item.category];
  const days = daysLeft(item.deadline);

  return (
    <View className="flex-1 overflow-hidden rounded-[32px] border-2 border-carbon bg-white">
      {/* Bloc titre */}
      <View
        style={{ backgroundColor: cat.bg }}
        className="h-[40%] justify-between p-5"
      >
        <View className="flex-row items-center justify-between">
          <Text
            style={{ color: cat.fg }}
            className="text-xs font-black uppercase tracking-widest"
          >
            {cat.label}
          </Text>
          <FundingBadge type={item.funding_type} />
        </View>
        <Text
          className="font-black"
          style={{
            color: cat.fg,
            fontSize: 30,
            lineHeight: 32,
            letterSpacing: -1,
          }}
          numberOfLines={3}
        >
          {item.title}
        </Text>
      </View>

      {/* Infos */}
      <View className="flex-1 gap-3 p-5">
        <Text className="text-sm font-bold text-slate-500">
          {item.organizer}
        </Text>

        <View className="flex-row items-center gap-2">
          <MapPin size={16} color="#0F172A" />
          <Text className="font-semibold text-carbon">{item.location}</Text>
        </View>

        <View className="flex-row items-center gap-2">
          <CalendarClock size={16} color="#0F172A" />
          <Text className="font-semibold text-carbon">
            Deadline · {formatDeadline(item.deadline)}
          </Text>
          <View className="rounded-full bg-carbon px-2 py-0.5">
            <Text className="text-[11px] font-black text-white">J-{days}</Text>
          </View>
        </View>

        <View className="my-1 h-[2px] bg-slate-100" />

        <View className="gap-2">
          {item.summary_points.map((p) => (
            <View key={p} className="flex-row items-start gap-2">
              <View
                className="mt-[6px] h-2 w-2 bg-lime"
                style={{ borderWidth: 1, borderColor: "#0F172A" }}
              />
              <Text className="flex-1 text-[15px] leading-5 text-carbon">
                {p}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
