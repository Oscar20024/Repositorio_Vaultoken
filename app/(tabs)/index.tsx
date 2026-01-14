import { playClick } from "@/utils/sound";
import React from "react";
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

<Pressable onPress={playClick}>
  <Text>Empezar</Text>
</Pressable>
//cambio 13
export default function Home() {
  const onPressX = async () => {
  await playClick();
  // acción del botón
};

<Pressable onPress={onPressX} />

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🛡️</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🔥 3</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⭐ 120</Text>
          </View>
        </View>

        <Text style={styles.title}>Vaultoken</Text>
        <Text style={styles.subtitle}>
          Aprende ciberseguridad jugando, sube de nivel y mantén tu racha.
        </Text>

        <Pressable style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Empezar lección</Text>
        </Pressable>
      </View>

      {/* Ruta / Secciones */}
      <Text style={styles.sectionTitle}>Ruta de aprendizaje</Text>

      <View style={styles.card}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>🔐</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>Fundamentos</Text>
          <Text style={styles.cardDesc}>Contraseñas, MFA, ingeniería social.</Text>
          <View style={styles.pillRow}>
            <Text style={styles.pill}>⏱️ 5 min</Text>
            <Text style={styles.pill}>🎯 Fácil</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>🎣</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>Phishing y estafas</Text>
          <Text style={styles.cardDesc}>Detecta correos y enlaces peligrosos.</Text>
          <View style={styles.pillRow}>
            <Text style={styles.pill}>⏱️ 7 min</Text>
            <Text style={styles.pill}>🧠 Medio</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>🌐</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>Seguridad web</Text>
          <Text style={styles.cardDesc}>Cookies, sesiones, ataques comunes.</Text>
          <View style={styles.pillRow}>
            <Text style={styles.pill}>⏱️ 8 min</Text>
            <Text style={styles.pill}>🚀 Avanza</Text>
          </View>
        </View>
      </View>

      {/* Accesos rápidos */}
      <Text style={styles.sectionTitle}>Accesos rápidos</Text>

      <View style={styles.grid}>
        <Pressable style={styles.smallCard}>
          <Text style={styles.smallIcon}>🏆</Text>
          <Text style={styles.smallTitle}>Logros</Text>
          <Text style={styles.smallDesc}>Medallas y retos</Text>
        </Pressable>

        <Pressable style={styles.smallCard}>
          <Text style={styles.smallIcon}>📚</Text>
          <Text style={styles.smallTitle}>Repasar</Text>
          <Text style={styles.smallDesc}>Lo que fallaste</Text>
        </Pressable>

        <Pressable style={styles.smallCard}>
          <Text style={styles.smallIcon}>🧩</Text>
          <Text style={styles.smallTitle}>Quiz</Text>
          <Text style={styles.smallDesc}>3–5 preguntas</Text>
        </Pressable>

        <Pressable style={styles.smallCard}>
          <Text style={styles.smallIcon}>⚙️</Text>
          <Text style={styles.smallTitle}>Ajustes</Text>
          <Text style={styles.smallDesc}>Cuenta y app</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Tip del día</Text>
        <Text style={styles.footerSub}>
          Activa 2FA (doble factor) en tus cuentas principales.
        </Text>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0B1220",
  },
  content: {
    padding: 18,
    paddingTop: 22,
  },

  header: {
    backgroundColor: "#121B33",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 18,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeText: {
    color: "white",
    fontWeight: "700",
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 6,
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  primaryBtn: {
    backgroundColor: "#22C55E",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#07110A",
    fontWeight: "900",
    fontSize: 16,
  },

  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 6,
    marginBottom: 10,
  },

  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#0F1730",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 12,
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(34,197,94,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconText: {
    fontSize: 22,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 2,
  },
  cardDesc: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  pillRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  pill: {
    color: "rgba(255,255,255,0.85)",
    backgroundColor: "rgba(255,255,255,0.07)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  smallCard: {
    width: "48%",
    backgroundColor: "#121B33",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  smallIcon: {
    fontSize: 22,
    marginBottom: 8,
  },
  smallTitle: {
    color: "white",
    fontWeight: "900",
    fontSize: 14,
    marginBottom: 2,
  },
  smallDesc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    lineHeight: 16,
  },

  footer: {
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  footerText: {
    color: "white",
    fontWeight: "900",
    marginBottom: 4,
  },
  footerSub: {
    color: "rgba(255,255,255,0.75)",
    lineHeight: 18,
  },
});
