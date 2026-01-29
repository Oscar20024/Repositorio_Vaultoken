import { getSupabase } from "@/service/supabase";
import { resetProgress } from "@/storage/progreso"; // tu reset local
import { resetProfileProgressDb } from "@/storage/progresoDb"; // tu reset en BD
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
const supabase = getSupabase();

type ProfileRow = {
  id: string;
  username: string | null;
  xp: number | null;
  racha: number | null; // si ya cambiaste a racha, abajo te digo qué cambiar
  nivel: number | null; // si ya cambiaste a nivel, abajo te digo qué cambiar
};

export default function Perfil() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  const initials = useMemo(() => {
    const base = (profile?.username || email || "U").trim();
    return base.slice(0, 2).toUpperCase();
  }, [profile?.username, email]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;

      const user = authData.user;
      if (!user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? null);

      const { data: prof, error: pErr } = await supabase
        .from("profiles")
        .select("id, username, xp, racha, nivel")
        .eq("id", user.id)
        .single();

      if (pErr) throw pErr;

      setProfile(prof as ProfileRow);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo cargar tu perfil");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, []),
  );

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const xp = profile?.xp ?? 0;
  const level = profile?.nivel ?? 1;
  const streak = profile?.racha ?? 0;

  // Progreso simple: 0..100 (puedes cambiar fórmula)
  const levelGoal = Math.max(100, level * 120);
  const progress = Math.min(1, xp / levelGoal);

  if (loading) {
    return (
      <View style={s.loadingWrap}>
        <ActivityIndicator />
        <Text style={s.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }
  const resetTest = async () => {
    try {
      setLoading(true);
      await resetProgress(); // ✅ borra progreso local
      await resetProfileProgressDb(); // ✅ resetea XP/racha/nivel en BD
      await fetchProfile(); // ✅ refresca UI
      Alert.alert("Listo", "Reinicio de test aplicado");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo reiniciar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={s.header}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{initials}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={s.name}>{profile?.username || "Usuario"}</Text>
          <Text style={s.email}>{email || "sin email"}</Text>

          <View style={s.progressWrap}>
            <View style={s.progressBar}>
              <View
                style={[
                  s.progressFill,
                  { width: `${Math.round(progress * 100)}%` },
                ]}
              />
            </View>
            <Text style={s.progressText}>
              {xp} XP / {levelGoal} XP
            </Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <Text style={s.sectionTitle}>Tus estadísticas</Text>

      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Text style={s.statIcon}>⭐</Text>
          <Text style={s.statValue}>{xp}</Text>
          <Text style={s.statLabel}>XP</Text>
        </View>

        <View style={s.statCard}>
          <Text style={s.statIcon}>🏅</Text>
          <Text style={s.statValue}>{level}</Text>
          <Text style={s.statLabel}>Nivel</Text>
        </View>

        <View style={s.statCard}>
          <Text style={s.statIcon}>🔥</Text>
          <Text style={s.statValue}>{streak}</Text>
          <Text style={s.statLabel}>Racha</Text>
        </View>
      </View>

      {/* Acciones */}
      <Text style={s.sectionTitle}>Acciones</Text>

      <Pressable style={s.actionBtn} onPress={fetchProfile}>
        <Text style={s.actionBtnText}>🔄 Actualizar datos</Text>
      </Pressable>

      <Pressable style={[s.actionBtn, s.dangerBtn]} onPress={logout}>
        <Text style={[s.actionBtnText, s.dangerText]}>🚪 Cerrar sesión</Text>
      </Pressable>

      {/* Tip */}
      <View style={s.tip}>
        <Text style={s.tipTitle}>Tip rápido</Text>
        <Text style={s.tipText}>
          Mantén tu racha: 1 lección al día vale más que 2 horas una sola vez.
        </Text>
      </View>

      <View style={{ height: 18 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0B1220" },
  content: { padding: 18, paddingTop: 18 },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B1220",
  },
  loadingText: { marginTop: 10, color: "rgba(255,255,255,0.75)" },

  header: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: "#121B33",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 16,
    alignItems: "center",
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(88,204,2,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "white", fontWeight: "900", fontSize: 18 },
  name: { color: "white", fontSize: 18, fontWeight: "900" },
  email: { color: "rgba(255,255,255,0.7)", marginTop: 2 },

  progressWrap: { marginTop: 10 },
  progressBar: {
    height: 10,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: 10,
    backgroundColor: "#58CC02",
    borderRadius: 999,
  },
  progressText: {
    marginTop: 6,
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "700",
  },

  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 6,
    marginBottom: 10,
  },

  statsRow: { flexDirection: "row", gap: 12, marginBottom: 6 },
  statCard: {
    flex: 1,
    backgroundColor: "#0F1730",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  statIcon: { fontSize: 20, marginBottom: 6 },
  statValue: { color: "white", fontWeight: "900", fontSize: 18 },
  statLabel: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
    fontWeight: "700",
    fontSize: 12,
  },

  actionBtn: {
    backgroundColor: "#121B33",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    marginBottom: 10,
  },
  actionBtnText: { color: "white", fontWeight: "900" },
  dangerBtn: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderColor: "rgba(239,68,68,0.25)",
  },
  dangerText: { color: "#FCA5A5" },

  tip: {
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  tipTitle: { color: "white", fontWeight: "900", marginBottom: 4 },
  tipText: { color: "rgba(255,255,255,0.75)", lineHeight: 18 },
});
