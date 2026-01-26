import { router } from "expo-router";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const mapa = require("../../assets/images/mapa-niveles.png");
const { width: iw, height: ih } = Image.resolveAssetSource(mapa);

// ISLAS
const islas = {
  isla1: require("../../assets/images/isla1.png"),
  isla2: require("../../assets/images/isla2.png"),
  isla3: require("../../assets/images/isla3.png"),
} as const;

// 2 TIPOS DE PUNTOS (PNG)
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
      y: number; // 0..1
      tipo: "isla";
      islaTipo: IslaTipo;
      w?: number;
      h?: number;
    }
  | {
      id: number;
      x: number; // 0..1
      y: number; // 0..1
      tipo: "punto";
      puntoTipo: PuntoTipo;
      s?: number; // tamaño (cuadrado)
    };

export default function Home() {
  const { width } = useWindowDimensions();
  const height = (width * ih) / iw;

  // 🔧 Ajusta x/y de puntos y islas hasta que calce con tu mapa
  const nodos: Nodo[] = [
    {
      id: 1,
      x: 0.7,
      y: 0.028,
      tipo: "isla",
      islaTipo: "isla1",
      w: 120,
      h: 80,
    },
    { id: 2, x: 0.5, y: 0.3, tipo: "punto", puntoTipo: "punto1", s: 44 },
    { id: 3, x: 0.56, y: 0.42, tipo: "punto", puntoTipo: "punto2", s: 44 },

    { id: 20, x: 0.4, y: 0.7, tipo: "isla", islaTipo: "isla3", w: 120, h: 80 },
    { id: 21, x: 0.43, y: 0.8, tipo: "punto", puntoTipo: "punto2", s: 44 },
    {
      id: 17,
      x: 0.62,
      y: 0.52,
      tipo: "isla",
      islaTipo: "isla2",
      w: 130,
      h: 90,
    },
    { id: 11, x: 0.58, y: 0.62, tipo: "punto", puntoTipo: "punto1", s: 44 },
    {
      id: 15,
      x: 0.62,
      y: 0.52,
      tipo: "isla",
      islaTipo: "isla2",
      w: 130,
      h: 90,
    },
    {
      id: 13,
      x: 0.62,
      y: 0.52,
      tipo: "isla",
      islaTipo: "isla2",
      w: 130,
      h: 90,
    },
    {
      id: 12,
      x: 0.62,
      y: 0.52,
      tipo: "isla",
      islaTipo: "isla2",
      w: 130,
      h: 90,
    },
    {
      id: 11,
      x: 0.62,
      y: 0.52,
      tipo: "isla",
      islaTipo: "isla2",
      w: 130,
      h: 90,
    },
  ];

  return (
    <ScrollView>
      <View style={{ width, height, position: "relative" }}>
        <ImageBackground
          source={mapa}
          style={{ width, height }}
          resizeMode="stretch"
        />

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
                  top: n.y * height - h / 2,
                  width: w,
                  height: h,
                }}
              >
                <Image
                  source={islas[n.islaTipo]}
                  style={{ width: "100%", height: "100%" }}
                />
              </Pressable>
            );
          }

          // PUNTO PNG + NÚMERO ENCIMA
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
                top: n.y * height - s / 2,
                width: s,
                height: s,
              }}
            >
              <Image
                source={puntos[n.puntoTipo]}
                style={{ width: "100%", height: "100%" }}
                resizeMode="stretch"
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
