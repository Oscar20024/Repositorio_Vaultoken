// app/(tabs)/ataque.tsx
// ✅ Pantalla "Ataques" (dentro de tabs)
// ✅ Fondo azul #2b7cb2
// ✅ Imagen superior centrada (con tamaño controlado)
// ✅ 2 tarjetas centradas en el medio
// ✅ Imagen inferior centrada (con tamaño controlado)
// ✅ EXTRA: Ajuste fino para mover imágenes ARRIBA/ABAJO con 2 estilos

import { playClick } from "@/utils/sound";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, type Href } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Ataque() {
  // ✅ Navegación a pantallas FUERA de tabs (app/ataques-fisicos.tsx y app/ataques-logicos.tsx)
  const go = async (path: "/ataques-fisicos" | "/ataques-logicos") => {
    await playClick();
    router.push(path as Href);
  };

  return (
    <View style={s.container}>
      {/* =========================
          ✅ ZONA SUPERIOR (IMAGEN)
          - Centrada
          - Tamaño en s.topImg
          - Posición (arriba/abajo) en s.topImgMoveY
         ========================= */}
      <View style={s.topSpace}>
        <Image
          source={require("../../assets/images/imagenataque1.png")}
          style={[s.topImg, s.topImgMoveY]} // ✅ aquí se mueve arriba/abajo
        />
      </View>

      {/* =========================
          ✅ ZONA CENTRAL (TARJETAS)
          - Centradas verticalmente
          - Separadas con gap
         ========================= */}
      <View style={s.centerWrap}>
        {/* ====== CARD 1: Ataques Físicos ====== */}
        <Pressable style={s.card} onPress={() => go("/ataques-fisicos")}>
          <View style={s.row}>
            <LinearGradient colors={["#FB923C", "#EF4444"]} style={s.iconBox}>
              <Ionicons name="person" size={30} color="white" />
            </LinearGradient>

            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>Ataques Físicos</Text>
              <Text style={s.cardText}>
                Defiende tu oficina de intrusos, tailgating, robo de
                dispositivos y más
              </Text>
            </View>
          </View>
        </Pressable>

        {/* ====== CARD 2: Ataques Lógicos ====== */}
        <Pressable style={s.card} onPress={() => go("/ataques-logicos")}>
          <View style={s.row}>
            <LinearGradient colors={["#A78BFA", "#3B82F6"]} style={s.iconBox}>
              <Ionicons name="desktop" size={28} color="white" />
            </LinearGradient>

            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>Ataques Lógicos</Text>
              <Text style={s.cardText}>
                Detecta y neutraliza malware, phishing, DDoS y otras amenazas
                digitales
              </Text>
            </View>
          </View>
        </Pressable>
      </View>

      {/* =========================
          ✅ ZONA INFERIOR (IMAGEN)
          - Centrada
          - Tamaño en s.bottomImg
          - Posición (arriba/abajo) en s.bottomImgMoveY
         ========================= */}
      <View style={s.bottomSpace}>
        <Image
          source={require("../../assets/images/imagenataques2.png")}
          style={[s.bottomImg, s.bottomImgMoveY]} // ✅ aquí se mueve arriba/abajo
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  /* ✅ CONTENEDOR PRINCIPAL */
  container: {
    flex: 1,
    backgroundColor: "#2b7cb2",
    paddingHorizontal: 16,
  },

  /* ✅ ESPACIO PARA IMAGEN SUPERIOR */
  topSpace: {
    height: 180, // 🔧 reserva de espacio arriba
    justifyContent: "center",
    alignItems: "center",
  },

  /* ✅ ESPACIO PARA IMAGEN INFERIOR */
  bottomSpace: {
    height: 170, // 🔧 reserva de espacio abajo
    justifyContent: "center",
    alignItems: "center",
  },

  /* ✅ CENTRO (TARJETAS) */
  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },

  /* ✅ CARD */
  card: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: "white",
    borderRadius: 26,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  row: { flexDirection: "row", gap: 14, alignItems: "flex-start" },

  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 6,
  },

  cardText: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 12,
  },

  /* ✅ TAMAÑO DE IMÁGENES */
  topImg: {
    width: 250,
    height: 230,
    resizeMode: "contain",
  },

  bottomImg: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },

  /* =========================
     ✅ MOVER IMÁGENES ARRIBA/ABAJO (AJUSTE FINO)
     - NEGATIVO = sube
     - POSITIVO = baja
     ========================= */
  topImgMoveY: {
    marginTop: 150, // 🔧 cambia este valor para mover la imagen superior
  },

  bottomImgMoveY: {
    marginBottom: 130, // 🔧 cambia este valor para mover la imagen inferior
  },
});
