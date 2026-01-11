import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "../service/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!email || !pass || !username) return Alert.alert("Completa todo");

    setLoading(true);

    // ✅ SOLO crea usuario. El perfil lo crea el TRIGGER.
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { username }, // <- esto lo usa el trigger
      },
    });

    setLoading(false);

    if (error) return Alert.alert("Error", error.message);

    // Si confirmación por email está activa, session será null (normal)
    if (!data.session) {
      Alert.alert(
        "Revisa tu correo",
        "Te enviamos un email para confirmar tu cuenta. Luego inicia sesión."
      );
      return router.replace("/login");
    }

    // Si NO hay confirmación por email, ya quedó logueado
    Alert.alert("Listo", "Cuenta creada");
    router.replace("/login");
  };

  return (
    <View style={s.container}>
      <View style={s.card}>
        <Text style={s.title}>Crear cuenta</Text>

        <Text style={s.label}>Usuario</Text>
        <TextInput
          style={s.input}
          value={username}
          onChangeText={setUsername}
          placeholder="oscar123"
          placeholderTextColor="#999"
        />

        <Text style={s.label}>Email</Text>
        <TextInput
          style={s.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="correo@..."
          placeholderTextColor="#999"
        />

        <Text style={s.label}>Contraseña</Text>
        <TextInput
          style={s.input}
          value={pass}
          onChangeText={setPass}
          secureTextEntry
          placeholder="********"
          placeholderTextColor="#999"
        />

        <Pressable
          style={({ pressed }) => [s.btn, pressed && { opacity: 0.85 }, loading && { opacity: 0.6 }]}
          onPress={onRegister}
          disabled={loading}
        >
          <Text style={s.btnText}>{loading ? "Creando..." : "Registrarme"}</Text>
        </Pressable>

        <Text style={s.footer}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" style={s.link}>
            Inicia sesión
          </Link>
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 18, backgroundColor: "#0b0f17" },
  card: { backgroundColor: "#121a2a", borderRadius: 18, padding: 18, borderWidth: 1, borderColor: "#22304a" },
  title: { color: "white", fontSize: 22, fontWeight: "700", marginBottom: 14 },
  label: { color: "#cbd5e1", marginTop: 10, marginBottom: 6, fontSize: 13 },
  input: { backgroundColor: "#0e1422", color: "white", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderColor: "#22304a" },
  btn: { marginTop: 16, backgroundColor: "#3b82f6", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  btnText: { color: "white", fontWeight: "700" },
  footer: { color: "#94a3b8", marginTop: 14, textAlign: "center" },
  link: { color: "#60a5fa", fontWeight: "700" },
});
