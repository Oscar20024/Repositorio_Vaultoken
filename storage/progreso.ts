// src/storage/progreso.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

// Guardamos el "máximo nivel desbloqueado"
const KEY_UNLOCKED_MAX = "unlockedMax";

// Devuelve el máximo nivel desbloqueado (por defecto 1)
export async function getUnlockedMax(): Promise<number> {
  const v = await AsyncStorage.getItem(KEY_UNLOCKED_MAX);
  const n = Number(v);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

// Guarda el máximo nivel desbloqueado
export async function setUnlockedMax(n: number) {
  await AsyncStorage.setItem(KEY_UNLOCKED_MAX, String(n));
}

// Marca un nivel como completado y desbloquea el siguiente
export async function completeLevel(levelId: number) {
  const current = await getUnlockedMax();

  // Si completas el 1 -> desbloquea 2, etc.
  const next = levelId + 1;

  // Guardamos el mayor (para no retroceder)
  const newMax = Math.max(current, next);
  await setUnlockedMax(newMax);

  return newMax;
}
// ✅ RESET para testing (vuelve a bloquear todo excepto nivel 1)
export async function resetProgress() {
  await AsyncStorage.removeItem(KEY_UNLOCKED_MAX);
}
