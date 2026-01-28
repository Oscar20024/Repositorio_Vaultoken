import { getSupabase } from "@/service/supabase";
const supabase = getSupabase();

import { playClick } from "@/utils/sound";
import Ionicons from "@expo/vector-icons/Ionicons"; // ✅ OJITO
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false); // ✅ nuevo
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      return Alert.alert("Error", error.message);
    }

    const userId = data.user?.id;
    if (!userId) {
      setLoading(false);
      return Alert.alert("Error", "No se pudo obtener el usuario");
    }

    const { data: profile, error: pError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (pError || !profile) {
      setLoading(false);
      return Alert.alert(
        "Error",
        "Perfil no encontrado. Intenta cerrar y volver a entrar.",
      );
    }

    setLoading(false);
    router.replace("/post-login");
  };

  const onPressLogin = async () => {
    await playClick();
    await signIn();
  };

  return (
    <ImageBackground
      source={require("../assets/images/login-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Log in</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#ddd"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        {/* ✅ Password con ojito */}
        <View style={styles.passWrap}>
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#ddd"
            secureTextEntry={!showPass} // ✅ clave
            value={password}
            onChangeText={setPassword}
            style={[styles.input, styles.passInput]}
          />

          <Pressable
            onPress={() => setShowPass((v) => !v)}
            style={styles.eyeBtn}
            hitSlop={10}
          >
            <Ionicons
              name={showPass ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#ff751f"
            />
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.9 },
            loading && { opacity: 0.6 },
          ]}
          onPress={onPressLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </Pressable>

        <Text style={styles.registerText}>
          ¿No tienes cuenta?{" "}
          <Link href="/register" style={styles.registerLink}>
            Regístrate
          </Link>
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.10)",
    justifyContent: "center",
    padding: 24,
    paddingTop: 350,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 15,
  },

  // ✅ estilos nuevos para el ojito
  passWrap: {
    position: "relative",
    marginBottom: 15, // para reemplazar el margin del input
  },
  passInput: {
    marginBottom: 0,
    paddingRight: 46, // espacio para el icono
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -20 }], // 20 = la mitad del alto (40)
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#ff751f",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  registerText: {
    marginTop: 18,
    color: "#eee",
    textAlign: "center",
    fontSize: 14,
  },
  registerLink: { color: "#ff751f", fontWeight: "bold" },
});
