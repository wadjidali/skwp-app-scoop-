import * as ImagePicker from "expo-image-picker";
import { Camera, Check } from "lucide-react-native";
import { ReactNode, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { CATEGORY_STYLE } from "../../constants/categories";
import { ROLE_LABEL } from "../../constants/gems";
import { ACCOUNT_LABEL, FREE_POSTS_LIMIT } from "../../constants/profile";
import { AccountType, Category, MyProfile, Role } from "../../types";
import {
    ProfileErrors,
    displayName,
    finalizeProfile,
    validateProfile,
} from "../../utils/profile";
import { Avatar } from "../ui/Avatar";

const ROLES: Role[] = ["junior", "reconversion", "senior"];
const ACCOUNT_TYPES: AccountType[] = ["person", "business"];
const CATEGORIES = Object.keys(CATEGORY_STYLE) as Category[];
const MAX_AVATAR_CHARS = 1_500_000; // ~1 Mo en base64

const INPUT_CLASS =
  "rounded-2xl border-2 border-carbon bg-white px-4 py-3 text-base text-carbon";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-black text-carbon">{label}</Text>
      {children}
      {hint && !error && <Text className="text-xs text-slate-500">{hint}</Text>}
      {error && <Text className="text-xs font-bold text-red-600">{error}</Text>}
    </View>
  );
}

type Props = {
  initial: MyProfile;
  submitLabel: string;
  onSubmit: (profile: MyProfile) => void;
};

export function ProfileForm({ initial, submitLabel, onSubmit }: Props) {
  const [draft, setDraft] = useState<MyProfile>(initial);
  const [submitted, setSubmitted] = useState(false);

  const errors = validateProfile(draft);
  const err = (k: keyof ProfileErrors) => (submitted ? errors[k] : undefined);
  const isBiz = draft.account_type === "business";

  const set = <K extends keyof MyProfile>(key: K, value: MyProfile[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const toggleInterest = (c: Category) =>
    set(
      "interests",
      draft.interests.includes(c)
        ? draft.interests.filter((x) => x !== c)
        : [...draft.interests, c],
    );

  const pickAvatar = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
        base64: true,
      });
      if (res.canceled) return;
      const b64 = res.assets[0]?.base64;
      if (!b64) return;
      if (b64.length > MAX_AVATAR_CHARS) {
        Alert.alert("Image trop lourde", "Choisis une image plus légère.");
        return;
      }
      set("avatar_url", `data:image/jpeg;base64,${b64}`);
    } catch {
      Alert.alert("Impossible d'ouvrir la galerie");
    }
  };

  const submit = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    onSubmit(finalizeProfile(draft));
  };

  return (
    <View className="gap-5">
      {/* Type de compte */}
      <View className="gap-2">
        <View className="flex-row gap-2">
          {ACCOUNT_TYPES.map((t) => {
            const active = draft.account_type === t;
            return (
              <Pressable
                key={t}
                onPress={() => set("account_type", t)}
                className={`flex-1 items-center rounded-full border-2 border-carbon py-3 ${
                  active ? "bg-carbon" : "bg-white"
                }`}
              >
                <Text
                  className={`text-sm font-black ${
                    active ? "text-white" : "text-carbon"
                  }`}
                >
                  {ACCOUNT_LABEL[t]}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {isBiz && (
          <Text className="text-xs text-slate-500">
            {FREE_POSTS_LIMIT} publications gratuites, puis une formule payante
            avec tableau de bord (bientôt).
          </Text>
        )}
      </View>

      {/* Photo / logo */}
      <View className="items-center gap-2">
        <Pressable onPress={pickAvatar} className="active:opacity-80">
          <Avatar name={displayName(draft)} uri={draft.avatar_url} size={96} />
          <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-carbon bg-lime">
            <Camera size={16} color="#0F172A" strokeWidth={3} />
          </View>
        </Pressable>
        {draft.avatar_url ? (
          <Pressable onPress={() => set("avatar_url", null)}>
            <Text className="text-xs font-bold text-slate-500 underline">
              Retirer la photo
            </Text>
          </Pressable>
        ) : (
          <Text className="text-xs text-slate-500">
            {isBiz ? "Ajoute ton logo" : "Ajoute ta photo"} (optionnel)
          </Text>
        )}
      </View>

      {/* Identité */}
      {isBiz ? (
        <>
          <Field label="Nom de l'organisation" error={err("org_name")}>
            <TextInput
              value={draft.org_name}
              onChangeText={(v) => set("org_name", v)}
              placeholder="Ex : Pan-African Innovation Hub"
              placeholderTextColor="#94A3B8"
              maxLength={50}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Site web (optionnel)" error={err("website")}>
            <TextInput
              value={draft.website}
              onChangeText={(v) => set("website", v)}
              placeholder="monsite.com"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              className={INPUT_CLASS}
            />
          </Field>
        </>
      ) : (
        <>
          <Field label="Nom complet" error={err("full_name")}>
            <TextInput
              value={draft.full_name}
              onChangeText={(v) => set("full_name", v)}
              placeholder="Ex : Aminata Diallo"
              placeholderTextColor="#94A3B8"
              maxLength={40}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Ton profil">
            <View className="flex-row gap-2">
              {ROLES.map((r) => {
                const active = draft.role === r;
                return (
                  <Pressable
                    key={r}
                    onPress={() => set("role", r)}
                    className={`flex-1 items-center rounded-full border-2 border-carbon py-2.5 ${
                      active ? "bg-carbon" : "bg-white"
                    }`}
                  >
                    <Text
                      className={`text-xs font-black ${
                        active ? "text-white" : "text-carbon"
                      }`}
                    >
                      {ROLE_LABEL[r]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>
        </>
      )}

      <Field
        label={isBiz ? "Présentation courte" : "Une phrase sur toi"}
        hint={`${draft.bio_short.length}/${isBiz ? 140 : 80}`}
      >
        <TextInput
          value={draft.bio_short}
          onChangeText={(v) => set("bio_short", v)}
          placeholder={
            isBiz
              ? "Ce que fait ton organisation"
              : "Ex : Étudiante en data, je cherche ma première mission"
          }
          placeholderTextColor="#94A3B8"
          maxLength={isBiz ? 140 : 80}
          multiline
          textAlignVertical="top"
          className={`${INPUT_CLASS} min-h-[72px]`}
        />
      </Field>

      <Field
        label="Comment te contacter"
        hint="Lien LinkedIn, email ou numéro WhatsApp avec indicatif. Masqué en mode discret."
        error={err("contact_link")}
      >
        <TextInput
          value={draft.contact_link}
          onChangeText={(v) => set("contact_link", v)}
          placeholder="linkedin.com/in/… ou +221…"
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
          autoCorrect={false}
          className={INPUT_CLASS}
        />
      </Field>

      <Field label="Pays (optionnel)">
        <TextInput
          value={draft.country}
          onChangeText={(v) => set("country", v)}
          placeholder="Ex : Sénégal"
          placeholderTextColor="#94A3B8"
          maxLength={40}
          className={INPUT_CLASS}
        />
      </Field>

      <Field label="Centres d'intérêt" error={err("interests")}>
        <View className="flex-row flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = draft.interests.includes(c);
            return (
              <Pressable
                key={c}
                onPress={() => toggleInterest(c)}
                className={`flex-row items-center gap-1 rounded-full border-2 border-carbon px-4 py-2 ${
                  active ? "bg-lime" : "bg-white"
                }`}
              >
                {active && <Check size={14} color="#0F172A" strokeWidth={3} />}
                <Text className="text-sm font-black text-carbon">
                  {CATEGORY_STYLE[c].label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Field>

      <Pressable
        onPress={submit}
        className="mt-2 items-center rounded-full bg-cobalt py-4 active:opacity-80"
      >
        <Text className="text-base font-black text-white">{submitLabel}</Text>
      </Pressable>
    </View>
  );
}
