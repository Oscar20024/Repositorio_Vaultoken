// app/(tabs)/index.tsx
import {
  ISLAS as islas,
  MAPAS as mapas,
  PUNTOS as puntos,
  TOP_ICONS as topIcons,
} from "@/app/assets";
import { getUnlockedMax, resetProgress } from "@/storage/progreso";
import { playClick } from "@/utils/sound";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Asset } from "expo-asset";
import { router, type Href } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

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

// ✅ lista de assets para precargar (mapas + islas + puntos + topIcons)
const ASSETS_TO_PRELOAD = [
  ...mapas,
  islas.isla1,
  islas.isla2,
  islas.isla3,
  puntos.punto1,
  puntos.punto2,
  topIcons.servidor,
  topIcons.ia,
  topIcons.virus,
  topIcons.simulador,
] as const;

async function preloadIndexAssets() {
  await Promise.all(
    ASSETS_TO_PRELOAD.map((m) => Asset.fromModule(m).downloadAsync()),
  );
}

export default function Home() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // ✅ máximo nivel desbloqueado
  const [unlockedMax, setUnlockedMax] = useState<number>(1);

  // ✅ preload interno (backup)
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await preloadIndexAssets();
      } catch (e) {
        // si falla igual no bloquees
      } finally {
        if (alive) setAssetsReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

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

  // ✅ Evita cálculos si assets aún no listos
  const { heights, totalHeight, offsets } = useMemo(() => {
    if (!assetsReady) {
      return { srcs: [], heights: [], totalHeight: 0, offsets: [] as number[] };
    }

    const _srcs = mapas.map((m) => Image.resolveAssetSource(m));
    const _heights = _srcs.map((s) => (width * s.height) / s.width);
    const _totalHeight = _heights.reduce((a, b) => a + b, 0);

    const _offsets: number[] = [];
    _heights.reduce((acc, h, i) => {
      _offsets[i] = acc;
      return acc + h;
    }, 0);

    return {
      srcs: _srcs,
      heights: _heights,
      totalHeight: _totalHeight,
      offsets: _offsets,
    };
  }, [assetsReady, width]);

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

  const goNivel = async (id: number, locked: boolean) => {
    if (locked) return;
    await playClick();
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

  const goTop = async (key: TopKey) => {
    await playClick();
    router.push(TOP[key] as Href);
  };

  // ✅ Loading simple mientras carga assets
  if (!assetsReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12, fontWeight: "800" }}>
          Cargando mapa...
        </Text>
      </View>
    );
  }

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
