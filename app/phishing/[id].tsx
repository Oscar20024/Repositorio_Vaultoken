// app/phishing/[id].tsx
import { PHISHING_LESSONS } from "@/data/phishingLessons";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PhishingLesson() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = id ? PHISHING_LESSONS[id] : null;

  const insets = useSafeAreaInsets();
  const extraTopAndroid = (StatusBar.currentHeight ?? 0) + 8;
  const top = Platform.OS === "android" ? extraTopAndroid : insets.top + 8;

  if (!lesson) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          padding: 16,
          paddingTop: top + 50,
        }}
      >
        <Text style={{ fontWeight: "900" }}>
          Lección no encontrada: {String(id)}
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ fontWeight: "900", color: "#2563EB" }}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
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

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: top + 50 }}>
        <Text style={{ fontSize: 22, fontWeight: "900" }}>{lesson.title}</Text>
        {lesson.minutes != null && (
          <Text style={{ marginTop: 6 }}>⏱ {lesson.minutes} min</Text>
        )}

        {lesson.sections.map((s, i) => (
          <View
            key={i}
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 14,
              backgroundColor: "#F3F4F6",
            }}
          >
            <Text style={{ fontWeight: "900" }}>{s.h}</Text>
            <Text style={{ marginTop: 6, lineHeight: 20 }}>{s.p}</Text>
          </View>
        ))}

        {lesson.tips?.length ? (
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: "900", fontSize: 16 }}>Tips</Text>
            {lesson.tips.map((t, i) => (
              <Text key={i} style={{ marginTop: 6 }}>
                • {t}
              </Text>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
