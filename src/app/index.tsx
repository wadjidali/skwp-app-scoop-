import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { AuthField } from "../components/auth/AuthField";
import { AuthShell } from "../components/auth/AuthShell";
import {
  OrDivider,
  Provider,
  SocialButtons,
} from "../components/auth/SocialButtons";
import { useAppStore, useHydrated } from "../store/useAppStore";
import { validateEmail } from "../utils/auth";

export default function LoginScreen() {
  const router = useRouter();
  const hydrated = useHydrated();
  const signedIn = useAppStore((s) => s.signedIn);
  const onboardingDone = useAppStore((s) => s.onboardingDone);
  const setSignedIn = useAppStore((s) => s.setSignedIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const emailError = validateEmail(email);
  const passwordError = password ? undefined : "Indique ton mot de passe.";

  // Authentification simulée : la vraie connexion (Supabase) viendra plus tard.
  // Le mot de passe n'est jamais enregistré sur l'appareil.
  const submit = () => {
    setSubmitted(true);
    if (emailError || passwordError) return;
    setSignedIn(true); // la redirection plus bas fait le reste
  };

  const social = (provider: Provider) => {
    console.log(`Connexion via ${provider}`);
    setSignedIn(true);
  };

  const forgot = () =>
    Alert.alert(
      "Mot de passe oublié",
      "La réinitialisation par email sera disponible avec la connexion réelle.",
    );

  // En attendant le chargement des données enregistrées (le splash est par-dessus)
  if (!hydrated) return <View className="flex-1 bg-paper" />;

  // Utilisateur déjà connecté : accueil direct (ou création du profil s'il manque)
  if (signedIn) {
    return <Redirect href={onboardingDone ? "/radar" : "/onboarding"} />;
  }

  return (
    <AuthShell
      title="Content de te revoir."
      subtitle="Connecte-toi pour retrouver ton radar."
      footer={
        <Pressable onPress={() => router.push("/signup")} hitSlop={8}>
          <Text className="text-sm text-slate-600">
            Pas encore de compte ?{" "}
            <Text className="font-black text-carbon underline">
              Créer un compte
            </Text>
          </Text>
        </Pressable>
      }
    >
      <AuthField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="toi@exemple.com"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        error={submitted ? emailError : undefined}
      />
      <AuthField
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        placeholder="Ton mot de passe"
        secure
        autoComplete="password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={submit}
        error={submitted ? passwordError : undefined}
      />

      <Pressable onPress={forgot} hitSlop={8} className="self-end">
        <Text className="text-sm font-bold text-cobalt">
          Mot de passe oublié ?
        </Text>
      </Pressable>

      <Pressable
        onPress={submit}
        className="items-center rounded-full bg-cobalt py-4 active:opacity-80"
      >
        <Text className="text-base font-black text-white">Se connecter</Text>
      </Pressable>

      <OrDivider />
      <SocialButtons onPress={social} />

      <View className="rounded-2xl border-2 border-dashed border-slate-300 px-3 py-2">
        <Text className="text-[11px] text-slate-500">
          Mode démo : aucune vérification réelle pour l'instant. La connexion
          sécurisée arrive avec le serveur.
        </Text>
      </View>
    </AuthShell>
  );
}
