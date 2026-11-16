import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Archive,
  Gem,
  LayoutDashboard,
  Radar,
  User,
} from "lucide-react-native";
import { colors } from "../../constants/colors";
import { useAppStore } from "../../store/useAppStore";

export default function TabsLayout() {
  const isBiz = useAppStore((s) => s.profile.account_type === "business");

  return (
    <>
      {/* Fond clair dans les onglets : texte de la barre d'état en sombre */}
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.cobalt,
          tabBarInactiveTintColor: "#94A3B8",
          tabBarLabelStyle: { fontWeight: "700", fontSize: 11 },
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopColor: "#E2E8F0",
          },
        }}
      >
        <Tabs.Screen
          name="radar"
          options={{
            title: "Radar",
            tabBarIcon: ({ color, size }) => (
              <Radar color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="gems"
          options={{
            title: "Pépites",
            tabBarIcon: ({ color, size }) => <Gem color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="vault"
          options={{
            title: isBiz ? "Dashboard" : "Coffre-fort",
            tabBarIcon: ({ color, size }) =>
              isBiz ? (
                <LayoutDashboard color={color} size={size} />
              ) : (
                <Archive color={color} size={size} />
              ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profil",
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tabs>
    </>
  );
}
