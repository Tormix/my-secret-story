import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, useCopy } from "../../components/ui";
export default function TabLayout() {
  const t = useCopy(),
    insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.rose,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
          height: 60 + Math.max(insets.bottom, 12),
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 12),
        },
        tabBarLabelStyle: { fontSize: 10, fontFamily: "Manrope" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("Descubrir", "Discover"),
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="sparkles-outline"
              size={21}
              color={typeof color === "string" ? color : colors.muted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t("Biblioteca", "Library"),
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="book-outline"
              size={21}
              color={typeof color === "string" ? color : colors.muted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: t("Premium", "Premium"),
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="diamond-outline"
              size={21}
              color={typeof color === "string" ? color : colors.muted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("Ajustes", "Settings"),
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="options-outline"
              size={21}
              color={typeof color === "string" ? color : colors.muted}
            />
          ),
        }}
      />
    </Tabs>
  );
}
