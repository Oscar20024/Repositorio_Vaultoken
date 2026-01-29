// teoria.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Teoria() {
  const insets = useSafeAreaInsets();

  const top =
    Platform.OS === "android"
      ? (StatusBar.currentHeight ?? 0) + 8
      : insets.top + 8;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Pressable
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top,
          left: 12,
          zIndex: 10000,
          padding: 10,
        }}
      >
        <Ionicons name="arrow-back" size={28} color="#F97316" />
      </Pressable>

      <View style={{ flex: 1, padding: 16, paddingTop: top + 60 }}>
        <Text style={{ fontSize: 24, fontWeight: "900", marginBottom: 10 }}>
          Teoría
        </Text>

        <Text style={{ fontSize: 15, lineHeight: 22, color: "#374151" }}>
          La seguridad informática busca proteger tus datos y tus cuentas. Se
          basa en tres ideas: confidencialidad (que nadie vea tu info),
          integridad (que no la cambien) y disponibilidad (que esté accesible
          cuando la necesites). En la práctica, usa contraseñas fuertes, doble
          factor (2FA), actualizaciones, copias de seguridad y cuidado con
          correos o links sospechosos (phishing).
        </Text>
      </View>
    </SafeAreaView>
  );
}
