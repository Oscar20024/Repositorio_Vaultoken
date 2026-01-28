// app/(tabs)/index.tsx
import { getUnlockedMax, resetProgress } from "@/storage/progreso";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router, type Href } from "expo-router";
import React, { useCallback, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View
} from "react-native";

// ✅ 4 TROZOS (PNG/JPG)
const mapas = [
  require("../../assets/images/mapa-1.png"),
  require("../../assets/images/mapa-2.png"),
  require("../../assets/images/mapa-3.png"),
  require("../../assets/images/mapa-4.png"),
] as const;

// ISLAS
const islas = {
  isla1: require("../../assets/images/isla1.png"),
  isla2: require("../../assets/images/isla2.png"),
  isla3: require("../../assets/images/isla3.png"),
} as const;

// PUNTOS
const puntos = {
  punto1: require("../../assets/images/punto1.png"),
  punto2: require("../../assets/images/punto2.png"),
} as const;

// ✅ ICONOS TOP BAR (los 4 nuevos)
const topIcons = {
  servidor: require("../../assets/images/servidor.png"),
  ia: require("../../assets/images/ia.png"),
  virus: require("../../assets/images/virus.png"),
  simulador: require("../../assets/images/simulador.png"),
} as const;

type IslaTipo = keyof typeof islas;
type PuntoTipo = keyof typeof puntos;

type Nodo =
  | {
      id: number;
      x: number; // 0..1
      y: number; // 0..1 (relativo al mapa completo)
      tipo: "isla";
      islaTipo: IslaTipo;
      w?: number;
      h?: number;
    }
  | {
      id: number;
      x: number; // 0..1
      y: number; // 0..1 (relativo al mapa completo)
      tipo: "punto";
      puntoTipo: PuntoTipo;
      s?: number;
    };

export default function Home() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // ✅ máximo nivel desbloqueado
  const [unlockedMax, setUnlockedMax] = useState<number>(1);

  // ✅ se ejecuta cada vez que vuelves a esta pantalla
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const max = await getUnlockedMax();
        if (alive) setUnlockedMax(max);
      })();
      return () => {
        alive = false;
      };
    }, []),
  );

  // tamaños reales de cada trozo (px)
  const srcs = mapas.map((m) => Image.resolveAssetSource(m));
  const heights = srcs.map((s) => (width * s.height) / s.width);
  const totalHeight = heights.reduce((a, b) => a + b, 0);

  // offsets acumulados
  const offsets: number[] = [];
  heights.reduce((acc, h, i) => {
    offsets[i] = acc;
    return acc + h;
  }, 0);

  // 🔧 Ajusta tus puntos/islas
  const nodos: Nodo[] = [
    { id: 1, x: 0.7, y: 0.022, tipo: "isla", islaTipo: "isla1", w: 120, h: 80 },
    { id: 2, x: 0.55, y: 0.031, tipo: "punto", puntoTipo: "punto1", s: 44 },
    { id: 3, x: 0.69, y: 0.033, tipo: "punto", puntoTipo: "punto2", s: 44 },
    { id: 4, x: 0.79, y: 0.037, tipo: "punto", puntoTipo: "punto1", s: 44 },
    { id: 5, x: 0.65, y: 0.039, tipo: "punto", puntoTipo: "punto1", s: 44 },
    {
      id: 6,
      x: 0.56,
      y: 0.134,
      tipo: "isla",
      islaTipo: "isla3",
      w: 120,
      h: 80,
    },
    { id: 7, x: 0.43, y: 0.163, tipo: "punto", puntoTipo: "punto2", s: 44 },
    {
      id: 15,
      x: 0.43,
      y: 0.078,
      tipo: "isla",
      islaTipo: "isla2",
      w: 130,
      h: 90,
    },
  ];

  const goNivel = (id: number, locked: boolean) => {
    if (locked) return;
    router.push({ pathname: "/nivel/[id]", params: { id: String(id) } });
  };

  // ✅ TOP NAV (fuera de tabs)
  const TOP = {
    servidor: "/tu-servidor",
    ia: "/simulador-ia",
    virus: "/virus",
    simulador: "/simulador",
  } as const;

  type TopKey = keyof typeof TOP;

  const goTop = (key: TopKey) => {
    router.push(TOP[key] as Href);
  };

  return (
    <ScrollView>
      <View style={{ width, height: totalHeight, position: "relative" }}>
        {/* ✅ TOP BAR INVISIBLE (solo se ven iconos) */}
        <View
          style={{
            position: "absolute",
            top: insets.top + 5,
            left: 12,
            right: 12,
            zIndex: 10000,
            backgroundColor: "transparent",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => goTop("servidor")}
            style={{ alignItems: "center" }}
          >
            <Image
              source={topIcons.servidor}
              style={{ width: 34, height: 34, resizeMode: "contain" }}
            />
            <Text style={{ fontSize: 11, fontWeight: "800" }}>Tu Servidor</Text>
          </Pressable>

          <Pressable
            onPress={() => goTop("ia")}
            style={{ alignItems: "center" }}
          >
            <Image
              source={topIcons.ia}
              style={{ width: 34, height: 34, resizeMode: "contain" }}
            />
            <Text style={{ fontSize: 11, fontWeight: "800" }}>
              Simulador IA
            </Text>
          </Pressable>

          <Pressable
            onPress={() => goTop("virus")}
            style={{ alignItems: "center" }}
          >
            <Image
              source={topIcons.virus}
              style={{ width: 34, height: 34, resizeMode: "contain" }}
            />
            <Text style={{ fontSize: 11, fontWeight: "800" }}>Virus</Text>
          </Pressable>

          <Pressable
            onPress={() => goTop("simulador")}
            style={{ alignItems: "center" }}
          >
            <Image
              source={topIcons.simulador}
              style={{ width: 34, height: 34, resizeMode: "contain" }}
            />
            <Text style={{ fontSize: 11, fontWeight: "800" }}>Simulador</Text>
          </Pressable>
        </View>

        {/* ✅ BOTÓN RESET (testing) */}
        <Pressable
          onPress={async () => {
            await resetProgress();
            const max = await getUnlockedMax();
            setUnlockedMax(max);
          }}
          style={{
            position: "absolute",
            top: 120,
            right: 12,
            zIndex: 9999,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 12,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <Text style={{ fontWeight: "900" }}>Reset</Text>
        </Pressable>

        {/* Fondo en 4 trozos */}
        {mapas.map((src, i) => (
          <Image
            key={`mapa-${i}`}
            source={src}
            style={{
              position: "absolute",
              left: 0,
              top: offsets[i],
              width,
              height: heights[i],
            }}
            resizeMode="cover"
          />
        ))}

        {/* Nodos encima */}
        {nodos.map((n) => {
          const locked = n.id > unlockedMax;

          if (n.tipo === "isla") {
            const w = n.w ?? 120;
            const h = n.h ?? 80;

            return (
              <Pressable
                key={`isla-${n.id}`}
                onPress={() => goNivel(n.id, locked)}
                style={{
                  position: "absolute",
                  left: n.x * width - w / 2,
                  top: n.y * totalHeight - h / 2,
                  width: w,
                  height: h,
                  opacity: locked ? 0.7 : 1,
                }}
              >
                <Image
                  source={islas[n.islaTipo]}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
              </Pressable>
            );
          }

          const s = n.s ?? 44;

          return (
            <Pressable
              key={`punto-${n.id}`}
              onPress={() => goNivel(n.id, locked)}
              style={{
                position: "absolute",
                left: n.x * width - s / 2,
                top: n.y * totalHeight - s / 2,
                width: s,
                height: s,
                opacity: locked ? 0.7 : 1,
              }}
            >
              <Image
                source={puntos[n.puntoTipo]}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />

              <Text
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontWeight: "900",
                }}
              >
                {n.id}
              </Text>

              {/* 🔒 candado pequeño a la derecha */}
              {locked && (
                <Ionicons
                  name="lock-closed"
                  size={14}
                  color="#111827"
                  style={{
                    position: "absolute",
                    right: -6,
                    top: "50%",
                    marginTop: -7,
                  }}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
