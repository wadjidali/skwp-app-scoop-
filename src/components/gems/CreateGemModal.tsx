import { Check, X } from "lucide-react-native";
import { ReactNode, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import {
    GEM_TYPE_STYLE,
    STAGE_LABEL,
    TARGET_PROFILE_OPTIONS,
} from "../../constants/gems";
import { Gem, GemDraft, GemType, ProjectStage } from "../../types";
import { draftToGem, validateGem } from "../../utils/gems";

const INITIAL_DRAFT: GemDraft = {
  type: "training",
  title: "",
  description: "",
  resource_url: "",
  session_date: "",
  project_stage: "idea",
  target_profiles: [],
};

const TYPES: GemType[] = ["training", "resource", "project"];

const TITLE_PLACEHOLDER: Record<GemType, string> = {
  training: "Ex : Live — réussir son entretien technique",
  resource: "Ex : Modèle de CV pour bourse internationale",
  project: "Ex : App de covoiturage étudiant",
};

const URL_LABEL: Record<GemType, string> = {
  training: "Lien d'inscription ou du live",
  resource: "Lien du document",
  project: "Lien (optionnel)",
};

const INPUT_CLASS =
  "rounded-2xl border-2 border-carbon bg-white px-4 py-3 text-base text-carbon";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-black text-carbon">{label}</Text>
      {children}
      {error && <Text className="text-xs font-bold text-red-600">{error}</Text>}
    </View>
  );
}

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (gem: Gem) => void;
};

export function CreateGemModal({ visible, onClose, onSubmit }: Props) {
  const [draft, setDraft] = useState<GemDraft>(INITIAL_DRAFT);
  const [submitted, setSubmitted] = useState(false);

  const errors = validateGem(draft);
  const showError = <K extends keyof typeof errors>(k: K) =>
    submitted ? errors[k] : undefined;

  const set = <K extends keyof GemDraft>(key: K, value: GemDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const reset = () => {
    setDraft(INITIAL_DRAFT);
    setSubmitted(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    onSubmit(draftToGem(draft));
    reset();
    onClose();
  };

  const toggleProfile = (p: string) =>
    set(
      "target_profiles",
      draft.target_profiles.includes(p)
        ? draft.target_profiles.filter((x) => x !== p)
        : [...draft.target_profiles, p],
    );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={close}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 bg-paper">
          {/* En-tête */}
          <View className="flex-row items-center justify-between px-5 pb-3 pt-5">
            <Text
              className="font-black text-carbon"
              style={{ fontSize: 30, letterSpacing: -1.5 }}
            >
              PUBLIER
            </Text>
            <Pressable
              onPress={close}
              hitSlop={12}
              className="h-10 w-10 items-center justify-center rounded-full border-2 border-carbon bg-white"
            >
              <X size={20} color="#0F172A" strokeWidth={3} />
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 20 }}
          >
            <Text className="text-sm text-slate-500">
              Zéro ego-post : chaque publication doit contenir un livrable
              (lien, date ou profils recherchés).
            </Text>

            {/* Choix du type */}
            <View className="flex-row gap-2">
              {TYPES.map((t) => {
                const active = draft.type === t;
                const s = GEM_TYPE_STYLE[t];
                return (
                  <Pressable
                    key={t}
                    onPress={() => set("type", t)}
                    style={active ? { backgroundColor: s.bg } : undefined}
                    className={`flex-1 items-center rounded-full border-2 border-carbon py-3 ${
                      active ? "" : "bg-white"
                    }`}
                  >
                    <Text
                      style={active ? { color: s.fg } : undefined}
                      className="text-sm font-black text-carbon"
                    >
                      {s.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Field label="Titre" error={showError("title")}>
              <TextInput
                value={draft.title}
                onChangeText={(v) => set("title", v)}
                placeholder={TITLE_PLACEHOLDER[draft.type]}
                placeholderTextColor="#94A3B8"
                className={INPUT_CLASS}
              />
            </Field>

            <Field
              label={
                draft.type === "project" ? "Ce que je construis" : "Description"
              }
              error={showError("description")}
            >
              <TextInput
                value={draft.description}
                onChangeText={(v) => set("description", v)}
                placeholder="Sois concret : que vont gagner les autres ?"
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
                className={`${INPUT_CLASS} min-h-[110px]`}
              />
            </Field>

            {/* Champs propres à la formation */}
            {draft.type === "training" && (
              <Field
                label="Date de la session"
                error={showError("session_date")}
              >
                <TextInput
                  value={draft.session_date}
                  onChangeText={(v) => set("session_date", v)}
                  placeholder="AAAA-MM-JJ (ex : 2026-12-05)"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numbers-and-punctuation"
                  className={INPUT_CLASS}
                />
              </Field>
            )}

            {/* Champs propres au projet */}
            {draft.type === "project" && (
              <>
                <Field label="Où j'en suis">
                  <View className="flex-row gap-2">
                    {(Object.keys(STAGE_LABEL) as ProjectStage[]).map((s) => {
                      const active = draft.project_stage === s;
                      return (
                        <Pressable
                          key={s}
                          onPress={() => set("project_stage", s)}
                          className={`flex-1 items-center rounded-full border-2 border-carbon py-2.5 ${
                            active ? "bg-carbon" : "bg-white"
                          }`}
                        >
                          <Text
                            className={`text-sm font-black ${
                              active ? "text-white" : "text-carbon"
                            }`}
                          >
                            {STAGE_LABEL[s]}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </Field>

                <Field
                  label="Profils recherchés"
                  error={showError("target_profiles")}
                >
                  <View className="flex-row flex-wrap gap-2">
                    {TARGET_PROFILE_OPTIONS.map((p) => {
                      const active = draft.target_profiles.includes(p);
                      return (
                        <Pressable
                          key={p}
                          onPress={() => toggleProfile(p)}
                          className={`flex-row items-center gap-1 rounded-full border-2 border-carbon px-3 py-2 ${
                            active ? "bg-lime" : "bg-white"
                          }`}
                        >
                          {active && (
                            <Check size={14} color="#0F172A" strokeWidth={3} />
                          )}
                          <Text className="text-sm font-black text-carbon">
                            {p}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </Field>
              </>
            )}

            {/* Lien : obligatoire sauf pour un projet */}
            <Field
              label={URL_LABEL[draft.type]}
              error={showError("resource_url")}
            >
              <TextInput
                value={draft.resource_url}
                onChangeText={(v) => set("resource_url", v)}
                placeholder="https://…"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                className={INPUT_CLASS}
              />
            </Field>

            <Pressable
              onPress={submit}
              className="mt-2 items-center rounded-full bg-cobalt py-4 active:opacity-80"
            >
              <Text className="text-base font-black text-white">Publier</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
