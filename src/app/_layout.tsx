import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../../global.css";
import { SplashScreen } from "../components/ui/SplashScreen";
import { useNotificationTap, useReminderSync } from "../hooks/useReminders";
import { checkSupabase } from "../lib/supabaseCheck";
import { configureNotifications } from "../services/notifications";
import { useHydrated } from "../store/useAppStore";

configureNotifications();

export default function RootLayout() {
  const hydrated = useHydrated();
  const [splashDone, setSplashDone] = useState(false);
  const [forced, setForced] = useState(false);
  const handleSplashEnd = useCallback(() => setSplashDone(true), []);

  // Sécurité : le splash sort au bout de 4 s même si le chargement des données traîne
  useEffect(() => {
    const t = setTimeout(() => setForced(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (__DEV__) checkSupabase();
  }, []);

  useReminderSync();
  useNotificationTap(splashDone && hydrated);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0038FF" }}>
      <StatusBar style="light" />

      {/* L'application est montée en arrière-plan pendant l'animation */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="profile-edit" options={{ presentation: "modal" }} />
        <Stack.Screen
          name="opportunity/[id]"
          options={{ presentation: "modal" }}
        />
      </Stack>

      {/* Le splash masque l'écran jusqu'à la fin de son animation */}
      {!splashDone && (
        <SplashScreen
          ready={hydrated || forced}
          onAnimationEnd={handleSplashEnd}
        />
      )}
    </GestureHandlerRootView>
  );
}
