import { supabase } from "@/service/supabase";
import { playClick } from "@/utils/sound";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const TabButtonWithSound = (props: any) => (
  <Pressable
    {...props}
    onPress={async () => {
      await playClick();
      props.onPress?.();
    }}
  />
);

// ✅ PNGs (ajusta nombres)
const ataqueIcon = require("../../assets/images/ataque.png");
const routerIcon = require("../../assets/images/router.png");

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login");
      setChecking(false);
    });
  }, []);

  if (checking) return null;

  const tint = Colors[colorScheme ?? "light"].tint;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#e7f0f1",
        tabBarInactiveTintColor: "#888",
        // opcional: si tu barra es clara, pon fondo oscuro; si es clara, quita esto
        // tabBarStyle: { backgroundColor: "#111" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarButton: (props) => <TabButtonWithSound {...props} />,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />

      {/* ✅ ATAQUE */}
      <Tabs.Screen
        name="ataque"
        options={{
          title: "Ataques",
          tabBarButton: (props) => <TabButtonWithSound {...props} />,
          tabBarIcon: ({ focused }) => (
            <Image
              source={ataqueIcon}
              style={{
                width: 24,
                height: 24,
                resizeMode: "contain",
                opacity: focused ? 1 : 0.7,
              }}
            />
          ),
        }}
      />

      {/* ✅ TU ROUTER */}
      <Tabs.Screen
        name="tu-router" // crea app/(tabs)/tu-router.tsx
        options={{
          title: "Tu Router",
          tabBarButton: (props) => <TabButtonWithSound {...props} />,
          tabBarIcon: ({ focused }) => (
            <Image
              source={routerIcon}
              style={{
                width: 24,
                height: 24,
                resizeMode: "contain",
                opacity: focused ? 1 : 0.7,
                tintColor: focused ? "#8793ad" : "#888", // ✅ aquí lo controlas
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: "Profile",
          tabBarButton: (props) => <TabButtonWithSound {...props} />,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />

      {/* <Tabs.Screen
        name="post-login"
        options={{
          href: null,
        }}
      /> */}
    </Tabs>
  );
}
