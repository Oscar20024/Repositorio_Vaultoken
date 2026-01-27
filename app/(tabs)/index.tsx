import { router } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

// ✅ 4 TROZOS (JPG)
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

type IslaTipo = keyof typeof islas;
type PuntoTipo = keyof typeof puntos;

type Nodo =
  | {
      id: number;
      x: number; // 0..1
      y: number; // 0..1 (RELATIVO A TODO EL MAPA COMPLETO)
      tipo: "isla";
      islaTipo: IslaTipo;
      w?: number;
      h?: number;
    }
  | {
      id: number;
      x: number; // 0..1
      y: number; // 0..1 (RELATIVO A TODO EL MAPA COMPLETO)
      tipo: "punto";
      puntoTipo: PuntoTipo;
      s?: number;
    };

export default function Home() {
  const { width } = useWindowDimensions();

  // tamaños reales de cada trozo (px)
  const srcs = mapas.map((m) => Image.resolveAssetSource(m));

  // escalamos cada trozo al ancho de pantalla
  const heights = srcs.map((s) => (width * s.height) / s.width);

  // altura total del mapa completo (suma de trozos)
  const totalHeight = heights.reduce((a, b) => a + b, 0);

  // offset top acumulado para posicionar cada trozo
  const offsets: number[] = [];
  heights.reduce((acc, h, i) => {
    offsets[i] = acc;
    return acc + h;
  }, 0);

  // 🔧 Ajusta x/y hasta que calce. IMPORTANTE: y es relativo al MAPA COMPLETO (totalHeight)
  const nodos: Nodo[] = [
    { id: 1, x: 0.7, y: 0.03, tipo: "isla", islaTipo: "isla1", w: 120, h: 80 },
    { id: 2, x: 0.5, y: 0.15, tipo: "punto", puntoTipo: "punto1", s: 44 },
    { id: 3, x: 0.56, y: 0.22, tipo: "punto", puntoTipo: "punto2", s: 44 },

    { id: 4, x: 0.62, y: 0.3, tipo: "isla", islaTipo: "isla2", w: 130, h: 90 },
    { id: 5, x: 0.58, y: 0.38, tipo: "punto", puntoTipo: "punto1", s: 44 },

    { id: 6, x: 0.4, y: 0.55, tipo: "isla", islaTipo: "isla3", w: 120, h: 80 },
    { id: 7, x: 0.43, y: 0.63, tipo: "punto", puntoTipo: "punto2", s: 44 },
  ];

  return (
    <ScrollView>
      {/* Contenedor gigante con posición relativa */}
      <View style={{ width, height: totalHeight, position: "relative" }}>
        {/* ✅ Fondo en 4 trozos, ABSOLUTE */}
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
            resizeMode="cover" // "contain" si ves recortes
          />
        ))}

        {/* ✅ Nodos encima */}
        {nodos.map((n) => {
          if (n.tipo === "isla") {
            const w = n.w ?? 120;
            const h = n.h ?? 80;

            return (
              <Pressable
                key={`isla-${n.id}`}
                onPress={() =>
                  router.push({
                    pathname: "/nivel/[id]",
                    params: { id: String(n.id) },
                  })
                }
                style={{
                  position: "absolute",
                  left: n.x * width - w / 2,
                  top: n.y * totalHeight - h / 2, // ✅ usa totalHeight
                  width: w,
                  height: h,
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
              onPress={() =>
                router.push({
                  pathname: "/nivel/[id]",
                  params: { id: String(n.id) },
                })
              }
              style={{
                position: "absolute",
                left: n.x * width - s / 2,
                top: n.y * totalHeight - s / 2, // ✅ usa totalHeight
                width: s,
                height: s,
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
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
