import { supabase } from "@/service/supabase";
import { playClick } from "@/utils/sound";
import { Link, router } from "expo-router";
import { useState } from "react";
//cambio 11
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
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);

    // 1) Login con Auth
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

    // 2) Verificar que exista perfil en public.profiles
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

    // 3) Todo OK -> entrar a la app
    router.replace("/(tabs)");
    //router.replace("/post-login"); //-->para el video de postlogin.tsx
  };

  const onPressLogin = async () => {
    await playClick(); // 🔊 sonido
    await signIn(); // 🔐 login
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

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#ddd"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

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
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.10)", // 🔥 antes 0.55 (menos oscuro)
    justifyContent: "center",
    padding: 24,
    paddingTop: 350, // ✅ nuevo: empuja todo hacia abajo (ajusta 60/80/100)
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
    backgroundColor: "#ff751f", // ✅ antes "#58CC02"
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
