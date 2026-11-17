import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { AuthField } from "../components/auth/AuthField";
import { AuthShell } from "../components/auth/AuthShell";
import {
    OrDivider,
    Provider,
    SocialButtons,
} from "../components/auth/SocialButtons";
import { useAppStore } from "../store/useAppStore";
import { validateEmail, validateNewPassword } from "../utils/auth";

export default function SignupScreen() {
  const router = useRouter();
  const setSignedIn = useAppStore((s) => s.setSignedIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailError = validateEmail(email);
  const passwordError = validateNewPassword(password);
  const termsError = accepted
    ? undefined
    : "Accepte les conditions pour continuer.";

  // Une fois « inscrit », on envoie vers la création du profil (ou l'accueil si le profil existe)
  const goNext = () => {
    setSignedIn(true);
    const done = useAppStore.getState().onboardingDone;
    router.replace(done ? "/radar" : "/onboarding");
  };

  // Inscription simulée : aucun compte réel n'est créé, le mot de passe n'est pas enregistré
  const submit = () => {
    setSubmitted(true);
    if (emailError || passwordError || termsError) return;
    goNext();
  };

  const social = (provider: Provider) => {
    console.log(`Inscription via ${provider}`);
    goNext();
  };

  return (
    <AuthShell
      title="Crée ton compte."
      subtitle="Quelques secondes, puis tu configures ton profil."
      footer={
        <Pressable onPress={() => router.replace("/")} hitSlop={8}>
          <Text className="text-sm text-slate-600">
            Déjà un compte ?{" "}
            <Text className="font-black text-carbon underline">
              Se connecter
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
        placeholder="8 caractères minimum"
        secure
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={submit}
        error={submitted ? passwordError : undefined}
      />

      <View className="gap-1.5">
        <Pressable
          onPress={() => setAccepted((a) => !a)}
          className="flex-row items-start gap-3"
        >
          <View
            className={`mt-0.5 h-6 w-6 items-center justify-center rounded-md border-2 border-carbon ${
              accepted ? "bg-lime" : "bg-white"
            }`}
          >
            {accepted && <Check size={14} color="#0F172A" strokeWidth={3} />}
          </View>
          <Text className="flex-1 text-sm leading-5 text-slate-600">
            J'accepte les conditions d'utilisation et la politique de
            confidentialité de SKWP.
          </Text>
        </Pressable>
        {submitted && termsError ? (
          <Text className="text-xs font-bold text-red-600">{termsError}</Text>
        ) : null}
      </View>

      <Pressable
        onPress={submit}
        className="items-center rounded-full bg-cobalt py-4 active:opacity-80"
      >
        <Text className="text-base font-black text-white">
          Créer mon compte
        </Text>
      </Pressable>

      <OrDivider />
      <SocialButtons onPress={social} verb="S'inscrire" />

      <View className="rounded-2xl border-2 border-dashed border-slate-300 px-3 py-2">
        <Text className="text-[11px] text-slate-500">
          Mode démo : aucun compte réel n'est créé pour l'instant.
        </Text>
      </View>
    </AuthShell>
  );
}
