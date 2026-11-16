import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileForm } from "../components/profile/ProfileForm";
import { useAppStore, useHydrated } from "../store/useAppStore";

export default function OnboardingScreen() {
  const router = useRouter();
  const hydrated = useHydrated();
  const profile = useAppStore((s) => s.profile);
  const saveProfile = useAppStore((s) => s.saveProfile);

  if (!hydrated) return <View className="flex-1 bg-cobalt" />;

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Text
              className="font-black text-carbon"
              style={{ fontSize: 40, lineHeight: 42, letterSpacing: -2 }}
            >
              TON PROFIL.
            </Text>
            <Text className="mt-1 text-base text-slate-500">
              Une minute pour que la communauté sache qui tu es. Tu pourras tout
              modifier plus tard.
            </Text>
          </View>

          <ProfileForm
            initial={profile}
            submitLabel="Entrer dans SKWP"
            onSubmit={(p) => {
              saveProfile(p);
              router.replace("/radar");
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
