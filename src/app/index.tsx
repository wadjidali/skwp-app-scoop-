import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";
import { useAppStore, useHydrated } from "../store/useAppStore";

type AuthButtonProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

function AuthButton({ label, icon, onPress }: AuthButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-center rounded-full bg-carbon px-6 py-4 active:opacity-80"
    >
      <Ionicons name={icon} size={22} color={colors.white} />
      <Text className="ml-3 text-base font-bold text-white">{label}</Text>
    </Pressable>
  );
}

export default function LoginScreen() {
  const hydrated = useHydrated();
  const signedIn = useAppStore((s) => s.signedIn);
  const onboardingDone = useAppStore((s) => s.onboardingDone);
  const setSignedIn = useAppStore((s) => s.setSignedIn);

  // Vraie authentification Supabase plus tard : pour l'instant, la connexion est simulée
  const handleAuth = (provider: "apple" | "google" | "email") => {
    console.log(`Connexion via ${provider}`);
    setSignedIn(true); // la redirection ci-dessous fait le reste
  };

  // En attendant le chargement des données enregistrées (le splash est par-dessus)
  if (!hydrated) return <View className="flex-1 bg-cobalt" />;

  // Utilisateur déjà connecté : accueil direct (ou création du profil s'il manque)
  if (signedIn) {
    return <Redirect href={onboardingDone ? "/radar" : "/onboarding"} />;
  }

  return (
    <View className="flex-1 bg-cobalt">
      {/* Image de fond plein écran */}
      <Image
        source={require("../../assets/images/skwp-hero.png")}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition="top"
      />

      {/* Contenu par-dessus */}
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-between px-6 pb-6 pt-4">
          <Text
            className="text-white font-black"
            style={{ fontSize: 88, lineHeight: 88, letterSpacing: -4 }}
          >
            SKWP.
          </Text>

          <View className="flex-1" />

          <View className="gap-3">
            <AuthButton
              label="Continuer avec Apple"
              icon="logo-apple"
              onPress={() => handleAuth("apple")}
            />
            <AuthButton
              label="Continuer avec Google"
              icon="logo-google"
              onPress={() => handleAuth("google")}
            />
            <AuthButton
              label="Continuer avec Email"
              icon="mail"
              onPress={() => handleAuth("email")}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
