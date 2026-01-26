import { LEVELS } from "@/data/levels";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

//plantilla/pantalla que muestra las preguntas del nivel y maneja la lógica básica

export default function NivelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const n = Number(id);

  const level = LEVELS[n];
  const accent = level?.theme?.accent ?? "#22C55E";
  const bg = level?.theme?.bg ?? "#FFFFFF";
  const textColor = level?.theme?.text ?? "#111827";

  const [i, setI] = useState(0);
  const [locked, setLocked] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);

  const q = useMemo(() => level?.questions?.[i], [level, i]);

  if (!level) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Nivel {String(id)} no existe</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ marginTop: 10, color: "#2563EB" }}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const check = (choice: number | boolean) => {
    if (!q || locked) return;

    let correct = false;
    if (q.type === "mc") correct = choice === q.answerIndex;
    if (q.type === "tf") correct = choice === q.answer;

    setOk(correct);
    setLocked(true);
  };

  const next = () => {
    setOk(null);
    setLocked(false);
    if (i < level.questions.length - 1) setI((v) => v + 1);
    else router.back(); // al terminar, vuelves al mapa (luego aquí puedes guardar XP)
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: bg }}>
      <Text style={{ fontSize: 22, fontWeight: "900", color: textColor }}>
        Nivel {level.id}: {level.title}
      </Text>
      <Text style={{ marginTop: 6, marginBottom: 16, color: textColor }}>
        {level.intro}
      </Text>

      {q && (
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: textColor }}>
            {q.prompt}
          </Text>

          {q.type === "mc" &&
            q.options.map((opt, idx) => (
              <Pressable
                key={idx}
                onPress={() => check(idx)}
                style={{
                  padding: 14,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: locked ? "#E5E7EB" : accent,
                  backgroundColor: "#FFFFFF",
                  opacity: locked ? 0.8 : 1,
                }}
              >
                <Text style={{ color: "#111827", fontWeight: "700" }}>
                  {opt}
                </Text>
              </Pressable>
            ))}

          {q.type === "tf" && (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => check(true)}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: locked ? "#E5E7EB" : accent,
                  backgroundColor: "#FFFFFF",
                  opacity: locked ? 0.8 : 1,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "900" }}>Verdadero</Text>
              </Pressable>

              <Pressable
                onPress={() => check(false)}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: locked ? "#E5E7EB" : accent,
                  backgroundColor: "#FFFFFF",
                  opacity: locked ? 0.8 : 1,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "900" }}>Falso</Text>
              </Pressable>
            </View>
          )}

          {locked && (
            <View style={{ marginTop: 8 }}>
              <Text
                style={{ fontWeight: "900", color: ok ? "#16A34A" : "#DC2626" }}
              >
                {ok ? "✔ Correcto" : "✘ Incorrecto"}
              </Text>
              {!!q.explain && (
                <Text style={{ marginTop: 6, color: textColor }}>
                  {q.explain}
                </Text>
              )}

              <Pressable
                onPress={next}
                style={{
                  marginTop: 12,
                  padding: 14,
                  borderRadius: 14,
                  backgroundColor: accent,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "900" }}>
                  {i < level.questions.length - 1 ? "Siguiente" : "Terminar"}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
