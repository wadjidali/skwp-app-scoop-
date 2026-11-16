import {
    Bookmark,
    CalendarClock,
    ExternalLink,
    FileText,
    GraduationCap,
    Rocket,
} from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { GEM_TYPE_STYLE, STAGE_LABEL } from "../../constants/gems";
import { CURRENT_USER_ID, getProfile } from "../../data/mock";
import { useAppStore } from "../../store/useAppStore";
import { Gem, GemType } from "../../types";
import { formatSession, timeAgo } from "../../utils/date";
import { openLink } from "../../utils/links";
import { displayName } from "../../utils/profile";
import { Avatar } from "../ui/Avatar";

const TYPE_ICON = {
  training: GraduationCap,
  resource: FileText,
  project: Rocket,
} as const satisfies Record<GemType, unknown>;

const ACTION_LABEL: Record<GemType, string> = {
  training: "S'inscrire",
  resource: "Ouvrir",
  project: "Proposer mon aide",
};

type Props = {
  gem: Gem;
  saved: boolean;
  onToggleSave: (id: string) => void;
};

export function GemCard({ gem, saved, onToggleSave }: Props) {
  const style = GEM_TYPE_STYLE[gem.type];
  const Icon = TYPE_ICON[gem.type];

  const myProfile = useAppStore((s) => s.profile);
  const author = getProfile(gem.author_id);
  const isMine = gem.author_id === CURRENT_USER_ID;
  const anonymous = !isMine && (author?.is_incognito ?? false);
  const authorName = isMine
    ? displayName(myProfile)
    : anonymous
      ? "Membre discret"
      : (author?.full_name ?? "Membre");

  const contactLink = !isMine && !anonymous ? author?.contact_link : "";
  const canAct =
    gem.type === "project" ? Boolean(contactLink) : Boolean(gem.resource_url);

  const handleAction = () => {
    if (gem.type === "project") {
      if (contactLink) openLink(contactLink);
    } else if (gem.resource_url) {
      openLink(gem.resource_url);
    }
  };

  return (
    <View className="mb-4 rounded-3xl border-2 border-carbon bg-white p-4">
      {/* Type + sauvegarde */}
      <View className="flex-row items-center justify-between">
        <View
          style={{ backgroundColor: style.bg }}
          className="flex-row items-center gap-1.5 rounded-full border-2 border-carbon px-3 py-1"
        >
          <Icon size={14} color={style.fg} strokeWidth={3} />
          <Text
            style={{ color: style.fg }}
            className="text-[11px] font-black uppercase tracking-wide"
          >
            {style.label}
          </Text>
        </View>
        <Pressable onPress={() => onToggleSave(gem.id)} hitSlop={12}>
          <Bookmark
            size={22}
            color="#0F172A"
            strokeWidth={2.5}
            fill={saved ? "#BEF264" : "transparent"}
          />
        </Pressable>
      </View>

      <Text
        className="mt-3 font-black text-carbon"
        style={{ fontSize: 22, lineHeight: 25, letterSpacing: -0.5 }}
      >
        {gem.title}
      </Text>
      <Text
        className="mt-2 text-[15px] leading-5 text-slate-600"
        numberOfLines={4}
      >
        {gem.description}
      </Text>

      {/* Bloc propre à la formation */}
      {gem.type === "training" && gem.session_date && (
        <View className="mt-3 flex-row items-center gap-2 self-start rounded-full bg-carbon px-3 py-1.5">
          <CalendarClock size={14} color="#FFFFFF" />
          <Text className="text-xs font-black text-white">
            {formatSession(gem.session_date)}
          </Text>
        </View>
      )}

      {/* Bloc propre au projet */}
      {gem.type === "project" && (
        <View className="mt-3 gap-2">
          {gem.project_stage && (
            <View className="flex-row items-center gap-2">
              <Text className="text-xs font-black uppercase text-slate-500">
                Où j'en suis
              </Text>
              <View className="rounded-full bg-carbon px-2.5 py-0.5">
                <Text className="text-[11px] font-black text-white">
                  {STAGE_LABEL[gem.project_stage]}
                </Text>
              </View>
            </View>
          )}
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="text-xs font-black uppercase text-slate-500">
              Cherche
            </Text>
            {gem.target_profiles.map((p) => (
              <View
                key={p}
                className="rounded-full border-2 border-carbon bg-lime px-2.5 py-0.5"
              >
                <Text className="text-[11px] font-black text-carbon">{p}</Text>
              </View>
            ))}
          </View>
          {gem.resource_url && (
            <Pressable
              onPress={() => openLink(gem.resource_url!)}
              className="flex-row items-center gap-1 self-start"
            >
              <ExternalLink size={14} color="#0038FF" strokeWidth={3} />
              <Text className="text-xs font-black text-cobalt">
                En savoir plus
              </Text>
            </Pressable>
          )}
        </View>
      )}

      <View className="my-3 h-[2px] bg-slate-100" />

      {/* Auteur + action */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-2">
          <Avatar
            name={authorName}
            uri={isMine ? myProfile.avatar_url : author?.avatar_url}
            size={32}
          />
          <View className="flex-1">
            <Text numberOfLines={1} className="text-sm font-bold text-carbon">
              {authorName}
            </Text>
            <Text className="text-[11px] text-slate-500">
              {timeAgo(gem.created_at)}
            </Text>
          </View>
        </View>

        {canAct && (
          <Pressable
            onPress={handleAction}
            className="rounded-full bg-cobalt px-4 py-2.5 active:opacity-80"
          >
            <Text className="text-sm font-black text-white">
              {ACTION_LABEL[gem.type]}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
