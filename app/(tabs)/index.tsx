import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Vaultoken</Text>
      <Text style={styles.subtitle}>Aprende ciberseguridad jugando</Text>

      <Pressable style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Empezar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#58CC02', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#eaffd0', marginBottom: 40, textAlign: 'center' },
  button: { backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30, elevation: 4 },
  buttonText: { color: '#58CC02', fontSize: 18, fontWeight: 'bold' },
});
