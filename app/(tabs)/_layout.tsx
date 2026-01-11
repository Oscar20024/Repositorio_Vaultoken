import { supabase } from "@/service/supabase";
import { playClick } from "@/utils/sound";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
const TabButtonWithSound = (props: any) => {
  return (
    <Pressable
      {...props}
      onPress={async () => {
        await playClick();   // 🔊 sonido
        props.onPress?.();   // 👉 navegación normal
      }}
    />
  );
};
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        // ❌ No logueado → fuera
        router.replace("/login");
      }
      setChecking(false);
    });
  }, []);

  // Mientras valida sesión, no renderiza nada
  if (checking) return null;




  return (
    
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
    <Tabs.Screen
  name="index"
  options={{
    title: "Inicio",
    tabBarButton: (props) => <TabButtonWithSound {...props} />,
    tabBarIcon: ({ color }) => (
      <TabBarIcon name="home" color={color} />
    ),
  }}
/>

      <Tabs.Screen
  name="perfil"
  options={{
    title: "Perfil",
    tabBarButton: (props) => <TabButtonWithSound {...props} />,
    tabBarIcon: ({ color }) => (
      <TabBarIcon name="user" color={color} />
    ),
  }}
/>

    </Tabs>
  );
}
