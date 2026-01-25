import { playClick } from "@/utils/sound";
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
import { supabase } from "../service/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [username, setUsername] = useState("");
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
    await playClick(); // 🔊 sonido
    await onRegister(); // 🔐 login
  };
  return (
    <ImageBackground
      source={require("../assets/images/register-bg.png")} // ✅ misma imagen que Login
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

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={pass}
          onChangeText={setPass}
          style={styles.input}
        />

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
    backgroundColor: "rgba(0,0,0,0.10)", // ✅ igual que tu Login (menos oscuro)
    justifyContent: "center",
    padding: 24,
    paddingTop: 270, // ✅ baja todo un poco
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

  button: {
    backgroundColor: "#ff751f", // ✅ naranja Canva
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
    color: "#ff751f", // ✅ link naranja también
    fontWeight: "bold",
  },
});
