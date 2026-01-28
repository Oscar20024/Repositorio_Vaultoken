import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TuServidor() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Pressable
        onPress={() => router.back()}
        style={{
          padding: 15,
          marginTop: insets.top - 65, // sube/baja aquí
          alignSelf: "flex-start",
        }}
      >
        <Ionicons name="arrow-back" size={28} color="#F97316" />
      </Pressable>

      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "900" }}>Tu Servidor</Text>
      </View>
    </SafeAreaView>
  );
}
