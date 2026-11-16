import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { X } from "lucide-react-native";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileForm } from "../components/profile/ProfileForm";
import { useAppStore, useHydrated } from "../store/useAppStore";

export default function ProfileEditScreen() {
  const router = useRouter();
  const hydrated = useHydrated();
  const profile = useAppStore((s) => s.profile);
  const saveProfile = useAppStore((s) => s.saveProfile);

  if (!hydrated) return <View className="flex-1 bg-paper" />;

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-paper">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-row items-center justify-between px-5 pb-3 pt-5">
          <Text
            className="font-black text-carbon"
            style={{ fontSize: 30, letterSpacing: -1.5 }}
          >
            MODIFIER
          </Text>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center rounded-full border-2 border-carbon bg-white"
          >
            <X size={20} color="#0F172A" strokeWidth={3} />
          </Pressable>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <ProfileForm
            initial={profile}
            submitLabel="Enregistrer"
            onSubmit={(p) => {
              saveProfile(p);
              router.back();
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
