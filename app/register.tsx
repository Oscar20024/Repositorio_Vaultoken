import { getSupabase } from "@/service/supabase";
import { playClick } from "@/utils/sound";
import Ionicons from "@expo/vector-icons/Ionicons"; // ✅ OJITO
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const supabase = getSupabase();

export default function Register() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [username, setUsername] = useState("");
  const [showPass, setShowPass] = useState(false); // ✅ nuevo
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!email || !pass || !username) return Alert.alert("Completa todo");

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { username } },
    });

    setLoading(false);

    if (error) return Alert.alert("Error", error.message);

    if (!data.session) {
      Alert.alert(
        "Revisa tu correo",
        "Te enviamos un email para confirmar tu cuenta. Luego inicia sesión.",
      );
      return router.replace("/login");
    }

    Alert.alert("Listo", "Cuenta creada");
    router.replace("/login");
  };

  const onPressRegister = async () => {
    await playClick();
    await onRegister();
  };

  return (
    <ImageBackground
      source={require("../assets/images/register-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Registrate</Text>

        <TextInput
          placeholder="Usuario"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
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
            placeholderTextColor="#aaa"
            secureTextEntry={!showPass}
            value={pass}
            onChangeText={setPass}
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
          onPress={onPressRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creando..." : "Registrarme"}
          </Text>
        </Pressable>

        <Text style={styles.registerText}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" style={styles.registerLink}>
            Inicia sesión
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
    paddingTop: 270,
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
    marginBottom: 15,
  },
  passInput: {
    marginBottom: 0,
    paddingRight: 46,
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -20 }], // centra (alto 40 / 2)
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

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  registerText: {
    marginTop: 18,
    color: "#eee",
    textAlign: "center",
    fontSize: 14,
  },

  registerLink: {
    color: "#ff751f",
    fontWeight: "bold",
  },
});
