// app/ataques-fisicos.tsx
// =============================================================
// ✅ ATAQUES FÍSICOS (FUERA DE TABS)
// ✅ FLECHA “PRO” (igual que TuServidor)
// ✅ SCROLL PARA PODER BAJAR
// ✅ PERSONAS = IMAGEN oficinista.png (caminan de izquierda a derecha)
// ✅ ESCRITORIO = IMAGEN desk.png (en vez del rectángulo marrón)
// ✅ LOS OFICINISTAS PASAN POR DETRÁS DE LA MESA (zIndex controlado)
// ✅ CONTROLES PARA MOVER ARRIBA/ABAJO:
//    - s.deskMoveY (mesa)
//    - s.peopleMoveY (oficinistas)
// =============================================================
import {
    ATAQUES_FISICOS_EVENTS,
    type AttackEvent,
} from "../data/ataquesFisicos.events";

import { playClick } from "@/utils/sound";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    ImageBackground,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ============================
// ✅ TIPOS (simple)
// ============================
type PersonType = "employee" | "visitor" | "suspicious";

type Person = { id: number; x: number; type: PersonType; speed: number };

export default function AtaquesFisicos() {
  // ============================
  // ✅ FLECHA PRO (MISMA LÓGICA)
  // ============================
  const insets = useSafeAreaInsets();
  const extraTopAndroid = (StatusBar.currentHeight ?? 0) + 8;
  const top = Platform.OS === "android" ? extraTopAndroid : insets.top + 8;

  const { width } = Dimensions.get("window");

  // ============================
  // ✅ ESTADO DEL JUEGO
  // ============================
  const [people, setPeople] = useState<Person[]>([]);
  const [score, setScore] = useState(0);
  const [activeEvent, setActiveEvent] = useState<AttackEvent | null>(null);
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState("");
  const events = ATAQUES_FISICOS_EVENTS;

  // ============================
  // ✅ EVENTOS (CORTO)
  // ============================

  // =============================================================
  // ✅ 1) SPAWN OFICINISTAS (aparecen cada X segundos)
  // =============================================================
  useEffect(() => {
    if (!running) return;

    const t = setInterval(() => {
      const r = Math.random();
      const type: PersonType =
        r > 0.75 ? "suspicious" : r > 0.5 ? "visitor" : "employee";

      setPeople((p) => [
        ...p,
        {
          id: Date.now(),
          x: -150, // empieza fuera de pantalla
          type,
          speed: 1 + Math.random() * 2, // velocidad
        },
      ]);
    }, 2200);

    return () => clearInterval(t);
  }, [running]);

  // =============================================================
  // ✅ 2) MOVER OFICINISTAS (de izquierda a derecha)
  // =============================================================
  useEffect(() => {
    if (!running) return;

    const t = setInterval(() => {
      setPeople((prev) =>
        prev
          .map((p) => ({ ...p, x: p.x + p.speed }))
          .filter((p) => p.x < width + 80),
      );
    }, 30);

    return () => clearInterval(t);
  }, [running, width]);

  // =============================================================
  // ✅ 3) EVENTO RANDOM (cada X segundos)
  // =============================================================
  useEffect(() => {
    if (!running || activeEvent) return;

    const t = setInterval(() => {
      const randomEvent =
        ATAQUES_FISICOS_EVENTS[
          Math.floor(Math.random() * ATAQUES_FISICOS_EVENTS.length)
        ];

      setActiveEvent(randomEvent);
    }, 6500);

    return () => clearInterval(t);
  }, [running, activeEvent]);

  // ============================
  // ✅ ACCIONES
  // ============================
  const start = () => {
    setRunning(true);
    setScore(0);
    setPeople([]);
    setActiveEvent(null);
    setMsg("");
  };

  const choose = (tool: string) => {
    if (!activeEvent) return;

    const ok = tool === activeEvent.correctTool;
    setScore((s) => (ok ? s + 10 : Math.max(0, s - 5)));
    setMsg(ok ? "✅ Correcto +10" : "❌ Incorrecto -5");
    setTimeout(() => setMsg(""), 1600);

    setActiveEvent(null);
  };

  // (opcional) color según tipo
  const badgeColor = (t: PersonType) =>
    t === "employee" ? "#3B82F6" : t === "visitor" ? "#22C55E" : "#EF4444";

  return (
    <SafeAreaView style={s.safe}>
      {/* =============================================================
          ✅ FLECHA PRO (SIEMPRE VISIBLE)
         ============================================================= */}
      <Pressable
        onPress={async () => {
          await playClick();
          router.back();
        }}
        style={[s.backBtn, { top }]}
      >
        <Ionicons name="arrow-back" size={28} color="#F97316" />
      </Pressable>

      {/* =============================================================
          ✅ SCROLL PARA PODER BAJAR
         ============================================================= */}
      <ScrollView contentContainerStyle={[s.content, { paddingTop: top + 50 }]}>
        {/* =======================
            ✅ TITULO + HUD
           ======================= */}
        <Text style={s.title}>Ataques Físicos</Text>

        <View style={s.hud}>
          <View style={s.hudBox}>
            <Text style={s.hudLabel}>Puntuación</Text>
            <Text style={s.hudValue}>{score}</Text>
          </View>
          <View style={s.hudBox}>
            <Text style={s.hudLabel}>Personas</Text>
            <Text style={s.hudValue}>{people.length}</Text>
          </View>
        </View>

        {!!msg && <Text style={s.msg}>{msg}</Text>}

        {!running && (
          <Pressable onPress={start} style={s.startBtn}>
            <Text style={s.startBtnText}>Comenzar Simulación</Text>
          </Pressable>
        )}

        {/* =============================================================
            ✅ ESCENA (FONDO OFICINA + OFICINISTAS + MESA)
            - AQUÍ PONES TU FONDO
            - OFICINISTAS PASAN DETRÁS DE LA MESA (zIndex)
           ============================================================= */}
        <View style={s.sceneWrap}>
          <ImageBackground
            // ✅ CAMBIA ESTE FONDO A TU IMAGEN
            source={require("../assets/images/oficina-bg.png")}
            style={s.scene}
            imageStyle={s.sceneImg}
            resizeMode="cover"
          >
            {/* ✅ overlay suave */}
            <View style={s.overlay} />

            {/* ✅ “piso” (solo visual) */}
            <View style={s.floor} />

            {/* =============================================================
                ✅ OFICINISTAS (DETRÁS DE LA MESA)
                - Para subir/bajar la ruta donde caminan:
                  cambia s.peopleMoveY (marginBottom)
               ============================================================= */}
            {people.map((p) => (
              <View
                key={p.id}
                style={[
                  s.personWrap,
                  s.peopleMoveY, // ✅ mueve arriba/abajo la fila completa
                  { left: p.x },
                ]}
              >
                {/* (opcional) indicador sospechoso */}
                {p.type === "suspicious" && (
                  <Ionicons
                    name="warning"
                    size={18}
                    color="#EF4444"
                    style={s.warn}
                  />
                )}

                {/* ✅ IMAGEN DEL OFICINISTA */}
                <Image
                  source={require("../assets/images/oficinista.png")}
                  style={s.personImg}
                  resizeMode="contain"
                />

                <View />
              </View>
            ))}

            {/* =============================================================
                ✅ MESA / ESCRITORIO (ENCIMA DE LOS OFICINISTAS)
                - Para subir/bajar la mesa:
                  cambia s.deskMoveY (marginBottom)
               ============================================================= */}
            <Image
              source={require("../assets/images/escritorio.png")}
              style={[s.deskImg, s.deskMoveY]}
              resizeMode="contain"
            />
          </ImageBackground>
        </View>

        {/* =======================
            ✅ EVENTO (si aparece)
           ======================= */}
        {activeEvent && (
          <View style={s.eventCard}>
            <Text style={s.eventTitle}>🚨 {activeEvent.title}</Text>
            <Text style={s.eventDesc}>{activeEvent.description}</Text>

            <Text style={s.eventQ}>¿Qué harías?</Text>

            <View style={{ gap: 10 }}>
              {activeEvent.tools.map((tool) => (
                <Pressable
                  key={tool}
                  style={s.eventBtn}
                  onPress={() => choose(tool)}
                >
                  <Text style={s.eventBtnText}>{tool}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* ✅ espacio extra */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  // ============================
  // ✅ BASE
  // ============================
  safe: { flex: 1, backgroundColor: "#2b7cb2" },
  content: { paddingHorizontal: 16, paddingBottom: 30 },

  // ============================
  // ✅ FLECHA PRO
  // ============================
  backBtn: {
    position: "absolute",
    left: 12,
    zIndex: 10000,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 999,
    elevation: 3,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  // ============================
  // ✅ TITULO + HUD
  // ============================
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 10,
  },
  hud: { flexDirection: "row", gap: 12, marginBottom: 10 },
  hudBox: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  hudLabel: { color: "#6B7280", fontWeight: "700", fontSize: 12 },
  hudValue: { color: "#111827", fontWeight: "900", fontSize: 22, marginTop: 2 },

  msg: {
    textAlign: "center",
    fontWeight: "900",
    marginBottom: 10,
    color: "#111827",
  },

  startBtn: {
    backgroundColor: "#F97316",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  startBtnText: { color: "white", fontWeight: "900", fontSize: 16 },

  // ============================
  // ✅ ESCENA
  // ============================
  sceneWrap: {
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  scene: { height: 360, width: "100%" },
  sceneImg: { opacity: 0.55 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  floor: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
    backgroundColor: "rgba(17,24,39,0.12)",
  },

  // =============================================================
  // ✅ OFICINISTAS (IMAGEN) - DETRÁS DE LA MESA
  // =============================================================
  personWrap: {
    position: "absolute",
    bottom: 105, // altura base donde caminan
    zIndex: 5, // ✅ DETRÁS
  },
  peopleMoveY: {
    // 🔧 MUEVE ARRIBA/ABAJO A TODOS LOS OFICINISTAS
    // negativo = suben, positivo = bajan
    marginBottom: -45,
  },
  personImg: {
    width: 150, // 🔧 tamaño del oficinista
    height: 150,
  },
  warn: { position: "absolute", top: -18, left: 22 },
  typeDot: {
    position: "absolute",
    right: -6,
    top: 10,
    width: 10,
    height: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "white",
  },

  // =============================================================
  // ✅ MESA / ESCRITORIO (IMAGEN) - ENCIMA DE OFICINISTAS
  // =============================================================
  deskImg: {
    position: "absolute",
    left: "50%",
    bottom: -20, // altura base de la mesa
    transform: [{ translateX: -140 }], // 🔧 centra según ancho
    width: 299, // 🔧 tamaño de mesa
    height: 299, // 🔧 agranda/reduce alto
    zIndex: 20, // ✅ ENCIMA
  },
  deskMoveY: {
    // 🔧 MUEVE ARRIBA/ABAJO LA MESA
    // negativo = sube, positivo = baja
    marginBottom: 0,
  },

  // ============================
  // ✅ EVENTO
  // ============================
  eventCard: {
    backgroundColor: "#FEF2F2",
    borderWidth: 2,
    borderColor: "#EF4444",
    borderRadius: 26,
    padding: 14,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#7F1D1D",
    marginBottom: 6,
  },
  eventDesc: { color: "#374151", fontWeight: "600", lineHeight: 18 },
  eventQ: {
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "900",
    color: "#111827",
  },
  eventBtn: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  eventBtnText: { fontWeight: "800", color: "#111827" },
});
