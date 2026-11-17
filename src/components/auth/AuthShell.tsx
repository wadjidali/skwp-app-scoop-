import { StatusBar } from "expo-status-bar";
import { ReactNode } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../ui/Logo";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

/** Mise en page commune aux écrans de connexion et d'inscription. */
export function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-paper">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            padding: 24,
            paddingBottom: 16,
          }}
        >
          <Logo size={40} />

          <View className="mt-8">
            <Text
              className="font-black text-carbon"
              style={{ fontSize: 36, lineHeight: 38, letterSpacing: -1.5 }}
            >
              {title}
            </Text>
            <Text className="mt-2 text-base text-slate-500">{subtitle}</Text>
          </View>

          <View className="mt-7 gap-4">{children}</View>

          <View className="flex-1" />
          <View className="mt-8 items-center">{footer}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
