import { playClick } from "@/utils/sound";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
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

type AttackType =
  | "malware"
  | "phishing"
  | "ddos"
  | "sql-injection"
  | "ransomware";
type Severity = "low" | "medium" | "high" | "critical";

type LogicalAttack = {
  id: number;
  type: AttackType;
  title: string;
  description: string;
  severity: Severity;
  actions: string[];
  correctAction: string;
  timestamp: Date;
};

export default function AtaquesLogicos() {
  // ✅ Flecha PRO (igual que TuServidor)
  const insets = useSafeAreaInsets();
  const extraTopAndroid = (StatusBar.currentHeight ?? 0) + 8;
  const top = Platform.OS === "android" ? extraTopAndroid : insets.top + 8;

  // ✅ Estado del juego
  const [attacks, setAttacks] = useState<LogicalAttack[]>([]);
  const [score, setScore] = useState(0);
  const [blocked, setBlocked] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [systemHealth, setSystemHealth] = useState(100);
  const [logs, setLogs] = useState<string[]>([
    "Sistema iniciado...",
    "Firewall activo",
    "Antivirus actualizado",
  ]);

  // Para limpiar timers (setTimeout) si sales o reinicias
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const attackTypes = useMemo<Omit<LogicalAttack, "id" | "timestamp">[]>(
    () => [
      {
        type: "malware",
        title: "Malware Detectado",
        description:
          "Se ha detectado un archivo malicioso intentando ejecutarse en el sistema",
        severity: "high",
        actions: [
          "Ignorar",
          "Cuarentena",
          "Eliminar inmediatamente",
          "Analizar primero",
        ],
        correctAction: "Cuarentena",
      },
      {
        type: "phishing",
        title: "Email de Phishing",
        description: "Email sospechoso solicitando credenciales urgentemente",
        severity: "medium",
        actions: [
          "Responder",
          "Bloquear remitente",
          "Reenviar",
          "Marcar como spam",
        ],
        correctAction: "Bloquear remitente",
      },
      {
        type: "ddos",
        title: "Ataque DDoS",
        description:
          "Múltiples solicitudes desde varias IPs están sobrecargando el servidor",
        severity: "critical",
        actions: [
          "Apagar servidor",
          "Activar rate limiting",
          "Ignorar",
          "Reiniciar",
        ],
        correctAction: "Activar rate limiting",
      },
      {
        type: "sql-injection",
        title: "SQL Injection",
        description:
          "Intento de inyección SQL detectado en formulario de login",
        severity: "high",
        actions: [
          "Permitir",
          "Bloquear IP",
          "Sanitizar entrada",
          "Cerrar base de datos",
        ],
        correctAction: "Sanitizar entrada",
      },
      {
        type: "ransomware",
        title: "Ransomware",
        description: "Archivos están siendo encriptados. Solicitan rescate",
        severity: "critical",
        actions: [
          "Pagar rescate",
          "Restaurar backup",
          "Formatear todo",
          "Esperar",
        ],
        correctAction: "Restaurar backup",
      },
    ],
    [],
  );

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${message}`, ...prev].slice(0, 10));
  };

  const clearAllTimers = () => {
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
      spawnIntervalRef.current = null;
    }
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  // ✅ Spawn attacks (cada 5s) + daño si no responden en 10s
  useEffect(() => {
    if (!gameRunning) {
      clearAllTimers();
      return;
    }

    clearAllTimers();

    spawnIntervalRef.current = setInterval(() => {
      const randomAttack =
        attackTypes[Math.floor(Math.random() * attackTypes.length)];
      const newAttack: LogicalAttack = {
        ...randomAttack,
        id: Date.now(),
        timestamp: new Date(),
      };

      setAttacks((prev) => [...prev, newAttack]);
      addLog(`⚠️ ${newAttack.title} detectado`);

      const timeoutId = setTimeout(() => {
        // si sigue activo después de 10s → daño y se remueve
        setAttacks((prev) => {
          const stillActive = prev.find((a) => a.id === newAttack.id);
          if (stillActive) {
            setSystemHealth((h) => Math.max(0, h - 10));
            addLog(`❌ Sistema comprometido por ${stillActive.title}`);
            return prev.filter((a) => a.id !== newAttack.id);
          }
          return prev;
        });
      }, 10000);

      timeoutsRef.current.push(timeoutId);
    }, 5000);

    return () => clearAllTimers();
  }, [gameRunning, attackTypes]);

  // ✅ Game over
  useEffect(() => {
    if (systemHealth <= 0 && gameRunning) {
      setGameRunning(false);
      addLog("💀 Sistema comprometido. Game Over");
    }
  }, [systemHealth, gameRunning]);

  const handleAction = (attackId: number, action: string) => {
    const attack = attacks.find((a) => a.id === attackId);
    if (!attack) return;

    setAttacks((prev) => prev.filter((a) => a.id !== attackId));

    if (action === attack.correctAction) {
      setScore((prev) => prev + 20);
      setBlocked((prev) => prev + 1);
      addLog(`✅ ${attack.title} bloqueado correctamente`);
    } else {
      setSystemHealth((prev) => Math.max(0, prev - 15));
      addLog(`❌ Respuesta incorrecta a ${attack.title}`);
    }
  };

  const startGame = () => {
    clearAllTimers();
    setGameRunning(true);
    setScore(0);
    setBlocked(0);
    setSystemHealth(100);
    setAttacks([]);
    setLogs([
      "Sistema iniciado...",
      "Firewall activo",
      "Antivirus actualizado",
    ]);
  };

  const severityBg = (sev: Severity) => {
    switch (sev) {
      case "low":
        return "#EAB308"; // yellow
      case "medium":
        return "#F97316"; // orange
      case "high":
        return "#EF4444"; // red
      case "critical":
        return "#7C3AED"; // purple
    }
  };

  const severityBorder = (sev: Severity) => {
    switch (sev) {
      case "low":
        return "#EAB308";
      case "medium":
        return "#F97316";
      case "high":
        return "#EF4444";
      case "critical":
        return "#7C3AED";
    }
  };

  const attackIconName = (type: AttackType) => {
    switch (type) {
      case "malware":
        return "bug-outline";
      case "phishing":
        return "mail-outline";
      case "ddos":
        return "wifi-outline";
      case "sql-injection":
        return "terminal-outline";
      case "ransomware":
        return "warning-outline";
    }
  };

  const healthColor =
    systemHealth > 50 ? "#22C55E" : systemHealth > 25 ? "#F97316" : "#EF4444";

  return (
    <SafeAreaView style={s.safe}>
      {/* ✅ Flecha PRO */}
      <Pressable
        onPress={async () => {
          await playClick();
          router.back();
        }}
        style={[s.backBtn, { top }]}
      >
        <Ionicons name="arrow-back" size={28} color="#F97316" />
      </Pressable>

      <ScrollView contentContainerStyle={[s.content, { paddingTop: top + 50 }]}>
        <Text style={s.title}>Ataques Lógicos</Text>
        <Text style={s.subtitle}>
          Simulación tipo “pantalla del sistema” con alertas
        </Text>

        {!gameRunning ? (
          <View style={s.startCard}>
            <View style={s.startIcon}>
              <Ionicons name="terminal-outline" size={34} color="white" />
            </View>

            <Text style={s.startTitle}>Centro de Operaciones</Text>
            <Text style={s.startDesc}>
              Monitorea tu sistema y responde a las alertas. No dejes que la
              salud llegue a 0.
            </Text>

            {systemHealth === 0 && (
              <View style={s.lastRun}>
                <Text style={s.lastRunT}>Última partida:</Text>
                <Text style={s.lastRunT}>
                  Puntuación: {score} | Bloqueados: {blocked}
                </Text>
              </View>
            )}

            <Pressable style={s.startBtn} onPress={startGame}>
              <Text style={s.startBtnText}>Iniciar Monitoreo</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* ✅ System Status */}
            <View style={s.monitor}>
              <View style={s.monitorTop}>
                <View style={s.monitorLeft}>
                  <Ionicons name="terminal-outline" size={18} color="#22C55E" />
                  <Text style={s.monitorTag}>SYSTEM-MONITOR</Text>
                </View>

                <View style={s.monitorStats}>
                  <View style={s.statBox}>
                    <Text style={s.statLabel}>Puntos</Text>
                    <Text style={s.statValue}>{score}</Text>
                  </View>
                  <View style={s.statBox}>
                    <Text style={s.statLabel}>Bloqueados</Text>
                    <Text style={s.statValue}>{blocked}</Text>
                  </View>
                </View>
              </View>

              {/* Health bar */}
              <View style={{ marginTop: 10 }}>
                <View style={s.healthRow}>
                  <Text style={s.healthLabel}>Salud del Sistema</Text>
                  <Text style={[s.healthPct, { color: healthColor }]}>
                    {systemHealth}%
                  </Text>
                </View>

                <View style={s.healthTrack}>
                  <View
                    style={[
                      s.healthFill,
                      {
                        width: `${systemHealth}%`,
                        backgroundColor: healthColor,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Logs */}
              <View style={s.logsBox}>
                {logs.map((log, idx) => (
                  <Text key={idx} style={s.logLine}>
                    {log}
                  </Text>
                ))}
              </View>

              {/* Stop button */}
              <Pressable
                style={s.stopBtn}
                onPress={() => {
                  setGameRunning(false);
                  addLog("⏸️ Monitoreo detenido");
                }}
              >
                <Ionicons name="pause-outline" size={18} color="#111827" />
                <Text style={s.stopBtnText}>Detener</Text>
              </Pressable>
            </View>

            {/* ✅ Active Attacks */}
            <View style={{ gap: 10 }}>
              {attacks.length === 0 && (
                <View style={s.safeCard}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={36}
                    color="#22C55E"
                  />
                  <Text style={s.safeT}>Sistema Seguro</Text>
                  <Text style={s.safeS}>Esperando siguiente amenaza...</Text>
                </View>
              )}

              {attacks.map((attack) => (
                <View
                  key={attack.id}
                  style={[
                    s.attackCard,
                    { borderColor: severityBorder(attack.severity) },
                  ]}
                >
                  <View style={s.attackHeader}>
                    <View
                      style={[
                        s.attackIconBox,
                        { backgroundColor: severityBg(attack.severity) },
                      ]}
                    >
                      <Ionicons
                        name={attackIconName(attack.type)}
                        size={18}
                        color="white"
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={s.attackTitleRow}>
                        <Text style={s.attackTitle}>{attack.title}</Text>
                        <View
                          style={[
                            s.badge,
                            { backgroundColor: severityBg(attack.severity) },
                          ]}
                        >
                          <Text style={s.badgeText}>
                            {attack.severity.toUpperCase()}
                          </Text>
                        </View>
                      </View>

                      <Text style={s.attackDesc}>{attack.description}</Text>
                    </View>
                  </View>

                  <Text style={s.actionLabel}>Acción requerida:</Text>

                  <View style={s.actionsGrid}>
                    {attack.actions.map((action) => (
                      <Pressable
                        key={action}
                        onPress={() => handleAction(attack.id, action)}
                        style={s.actionBtn}
                      >
                        <Text style={s.actionBtnText}>{action}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#2b7cb2" },
  content: { paddingHorizontal: 16, paddingBottom: 24 },

  // ✅ Flecha PRO
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

  title: { fontSize: 26, fontWeight: "900", color: "#111827" },
  subtitle: {
    marginTop: 6,
    color: "#ffffff",
    fontWeight: "600",
    marginBottom: 12,
  },

  // Start card
  startCard: {
    backgroundColor: "white",
    borderRadius: 26,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  startIcon: {
    width: 70,
    height: 70,
    borderRadius: 999,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  startTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },
  startDesc: {
    marginTop: 8,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 18,
  },
  lastRun: {
    marginTop: 12,
    backgroundColor: "#FEE2E2",
    borderRadius: 18,
    padding: 12,
  },
  lastRunT: { color: "#991B1B", fontWeight: "800", textAlign: "center" },
  startBtn: {
    marginTop: 14,
    backgroundColor: "#2563EB",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  startBtnText: { color: "white", fontWeight: "900", fontSize: 16 },

  // Monitor
  monitor: {
    backgroundColor: "#111827",
    borderRadius: 26,
    padding: 14,
    marginBottom: 12,
  },
  monitorTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monitorLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  monitorTag: { color: "white", fontWeight: "800", fontSize: 12 },
  monitorStats: { flexDirection: "row", gap: 14 },
  statBox: { alignItems: "center" },
  statLabel: { color: "#9CA3AF", fontSize: 11, fontWeight: "700" },
  statValue: { color: "white", fontSize: 16, fontWeight: "900", marginTop: 2 },

  healthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  healthLabel: { color: "#9CA3AF", fontSize: 12, fontWeight: "700" },
  healthPct: { fontSize: 12, fontWeight: "900" },
  healthTrack: {
    height: 10,
    backgroundColor: "#374151",
    borderRadius: 999,
    overflow: "hidden",
  },
  healthFill: { height: "100%", borderRadius: 999 },

  logsBox: {
    marginTop: 12,
    backgroundColor: "#000000",
    borderRadius: 14,
    padding: 10,
  },
  logLine: {
    color: "#22C55E",
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
    fontSize: 11,
    marginBottom: 4,
  },

  stopBtn: {
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  stopBtnText: { fontWeight: "900", color: "#111827" },

  // Safe card
  safeCard: {
    backgroundColor: "#ECFDF5",
    borderWidth: 2,
    borderColor: "#86EFAC",
    borderRadius: 22,
    padding: 16,
    alignItems: "center",
  },
  safeT: { marginTop: 6, color: "#166534", fontWeight: "900" },
  safeS: { marginTop: 2, color: "#4B5563", fontWeight: "600" },

  // Attack card
  attackCard: {
    backgroundColor: "white",
    borderWidth: 2,
    borderRadius: 22,
    padding: 12,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  attackHeader: { flexDirection: "row", gap: 10, marginBottom: 10 },
  attackIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  attackTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  attackTitle: { flex: 1, fontWeight: "900", color: "#111827" },
  attackDesc: {
    marginTop: 4,
    color: "#6B7280",
    fontWeight: "600",
    lineHeight: 18,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  badgeText: { color: "white", fontWeight: "900", fontSize: 11 },

  actionLabel: {
    color: "#374151",
    fontWeight: "900",
    fontSize: 12,
    marginBottom: 8,
  },

  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actionBtn: {
    width: "48%",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  actionBtnText: {
    color: "#111827",
    fontWeight: "800",
    fontSize: 13,
    textAlign: "center",
  },
});
