import { LEVELS } from "@/data/levels";
import { completeLevel } from "@/storage/progreso";
import { completeLevelPerfectDb } from "@/storage/progresoDb";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
// arriba (imports)

//plantilla/pantalla que muestra las preguntas del nivel y maneja la lógica básica

// app/nivel/[id].tsx
// Pantalla PLANTILLA:
// - Si el nivel es "theory": muestra pages y botón Siguiente/Terminar
// - Si el nivel es "quiz": muestra preguntas, valida % y si aprueba desbloquea el siguiente

export default function NivelScreen() {
  // 1) Leemos el id desde la ruta /nivel/1, /nivel/2, etc.
  const { id } = useLocalSearchParams<{ id: string }>();
  const n = Number(id);

  // 2) Buscamos el nivel en el diccionario
  const level = LEVELS[n];

  // 3) Colores por defecto si no existen
  const accent = level?.theme?.accent ?? "#22C55E";
  const bg = level?.theme?.bg ?? "#FFFFFF";
  const textColor = level?.theme?.text ?? "#111827";

  // 4) Estado general (reutilizamos "i" como índice)
  //    - en teoría: i = página actual
  //    - en quiz:   i = pregunta actual
  const scoreRef = useRef(0);
  const okRef = useRef<boolean | null>(null);

  const [i, setI] = useState(0);

  // 5) Estados solo para QUIZ
  const [score, setScore] = useState(0); // aciertos
  const [locked, setLocked] = useState(false); // evita responder 2 veces
  const [ok, setOk] = useState<boolean | null>(null); // correcto/incorrecto

  // 6) Reset cuando cambias de nivel (cuando cambia id)
  useEffect(() => {
    scoreRef.current = 0;
    setI(0);
    setOk(null);
    setLocked(false);
  }, [id]);

  // 7) Si el nivel no existe, mostramos error simple
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

  // =========================
  // MODO TEORÍA
  // =========================
  // app/nivel/[id].tsx
  // VA dentro del bloque:  if (level.mode === "theory") { ... }
  // REEMPLAZA tu return actual de teoría por este (o pega esto donde está tu return de teoría)

  if (level.mode === "theory") {
    const page = level.pages?.[i];

    const nextTheory = async () => {
      if (i < level.pages.length - 1) {
        setI((v) => v + 1);
        return;
      }

      try {
        await completeLevelPerfectDb(level.id, 10); // ✅ suma +10xp y sube nivel
        await completeLevel(level.id); // ✅ desbloqueo local
      } catch (e: any) {
        Alert.alert("Error", e?.message ?? "No se pudo actualizar");
      }

      router.canGoBack() ? router.back() : router.replace("/(tabs)");
    };

    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: bg }}>
        <Text style={{ fontSize: 22, fontWeight: "900", color: textColor }}>
          Nivel {level.id}: {level.title}
        </Text>

        <Text style={{ marginTop: 6, marginBottom: 16, color: textColor }}>
          {level.intro}
        </Text>

        {!page ? (
          <Text style={{ color: "#DC2626", fontWeight: "900" }}>
            Este nivel de teoría no tiene páginas.
          </Text>
        ) : (
          <View style={{ gap: 10 }}>
            {!!page.title && (
              <Text
                style={{ fontSize: 18, fontWeight: "900", color: textColor }}
              >
                {page.title}
              </Text>
            )}

            <Text style={{ color: textColor, lineHeight: 20 }}>
              {page.body}
            </Text>

            <Pressable
              onPress={nextTheory}
              style={{
                marginTop: 12,
                padding: 14,
                borderRadius: 14,
                backgroundColor: accent,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "900" }}>
                {i < level.pages.length - 1 ? "Siguiente" : "Terminar"}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  // =========================
  // MODO QUIZ (tu lógica actual)
  // =========================

  // pregunta actual
  const q = useMemo(() => level.questions?.[i], [level, i]);

  // Revisar respuesta (bloquea para que no respondan 2 veces)
  const check = (choice: number | boolean) => {
    if (!q || locked) return;

    let correct = false;
    if (q.type === "mc") correct = choice === q.answerIndex;
    if (q.type === "tf") correct = choice === q.answer;

    if (correct) scoreRef.current += 1;

    setOk(correct);
    setLocked(true);
  };
  // Botón siguiente/terminar
  // app/nivel/[id].tsx  -> dentro de nextQuiz(), justo antes de calcular passed/perfect
  const nextQuiz = async () => {
    if (i < level.questions.length - 1) {
      setOk(null);
      setLocked(false);
      setI((v) => v + 1);
      return;
    }

    const total = level.questions.length;
    const finalScore = scoreRef.current;

    const rate = level.passRate ?? 0.7;
    const passed = total > 0 && finalScore / total >= rate;
    const perfect = total > 0 && finalScore === total;

    try {
      if (perfect) await completeLevelPerfectDb(level.id, 10);
      if (passed) await completeLevel(level.id);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo actualizar");
    }

    router.canGoBack() ? router.back() : router.replace("/(tabs)");
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: bg }}>
      <Text style={{ fontSize: 22, fontWeight: "900", color: textColor }}>
        Nivel {level.id}: {level.title}
      </Text>
      <Text style={{ marginTop: 6, marginBottom: 16, color: textColor }}>
        {level.intro}
      </Text>

      {q ? (
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
                onPress={nextQuiz}
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
      ) : (
        <Text style={{ color: "#DC2626", fontWeight: "900" }}>
          Este nivel quiz no tiene preguntas.
        </Text>
      )}
    </View>
  );
}
