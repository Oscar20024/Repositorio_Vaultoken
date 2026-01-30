// app/phishing.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Image,
    Platform,
    Pressable,
    SafeAreaView,
    StatusBar,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { consumePhishing, getPhishingStatus } from "@/storage/phishing";

function fmt(ms: number) {
  const s = Math.ceil(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${h}h ${m}m ${ss}s`;
}

export default function Phishing() {
  const insets = useSafeAreaInsets();
  const extraTopAndroid = (StatusBar.currentHeight ?? 0) + 8;
  const top = Platform.OS === "android" ? extraTopAndroid : insets.top + 8;

  const [ready, setReady] = useState(false);
  const [msRemaining, setMsRemaining] = useState(0);
  const [lesson, setLesson] = useState<{
    id: string;
    title: string;
    minutes: number;
  } | null>(null);

  const refresh = useCallback(async () => {
    const st = await getPhishingStatus();
    setReady(st.ready);
    setMsRemaining(st.msRemaining);
    setLesson({
      id: st.lesson.id,
      title: st.lesson.title,
      minutes: st.lesson.minutes ?? 0, // ✅
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  useEffect(() => {
    if (ready) return;
    const t = setInterval(() => refresh(), 1000);
    return () => clearInterval(t);
  }, [ready, refresh]);

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

      <View
        style={{
          width: 240,
          height: 240,
          borderRadius: 120,
          overflow: "hidden",
          borderWidth: 6,
          borderColor: "white",
          backgroundColor: "white",
          alignSelf: "center",
          marginTop: top + 30,
          elevation: 6,
          shadowOpacity: 0.2,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <Image
          source={require("../assets/images/phishing.gif")}
          style={{
            width: "140%",
            height: "140%",
            marginLeft: "-15%",
            marginTop: "-15%",
          }}
          resizeMode="cover"
        />
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "900" }}>Phishing</Text>

        {lesson && (
          <View
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 14,
              backgroundColor: "#F3F4F6",
            }}
          >
            <Text style={{ fontWeight: "900" }}>{lesson.title}</Text>
            <Text style={{ marginTop: 4 }}>Duración: {lesson.minutes} min</Text>
          </View>
        )}

        <Text style={{ marginTop: 10 }}>
          {ready
            ? "✅ Hay una lección lista para aprender."
            : `⏳ Próxima en: ${fmt(msRemaining)}`}
        </Text>

        <Pressable
          disabled={!ready || !lesson}
          onPress={async () => {
            await consumePhishing();

            // ✅ Navegación SIN Href (cero errores TS)
            if (!lesson) return;

            router.push({
              pathname: "/phishing/[id]",
              params: { id: lesson.id },
            } as any);
          }}
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 14,
            opacity: ready ? 1 : 0.5,
            backgroundColor: "#22C55E",
          }}
        >
          <Text
            style={{ textAlign: "center", color: "white", fontWeight: "900" }}
          >
            {ready ? "Ver teoría" : "Aún no está lista"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
