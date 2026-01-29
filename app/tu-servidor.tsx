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

export default function TuServidor() {
  const insets = useSafeAreaInsets();

  // Extra para Android (porque a veces insets.top no compensa bien)
  const extraTopAndroid = (StatusBar.currentHeight ?? 0) + 8; // súbelo si quieres
  const top = Platform.OS === "android" ? extraTopAndroid : insets.top + 8;

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

      <View style={{ flex: 1, padding: 16, paddingTop: top + 50 }}>
        <Text style={{ fontSize: 22, fontWeight: "900" }}>Tu Servidor</Text>
      </View>
    </SafeAreaView>
  );
}
