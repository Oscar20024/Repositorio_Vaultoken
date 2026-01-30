// storage/phishing.ts
import { PHISHING_LESSONS, PHISHING_ORDER } from "@/data/phishingLessons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const NEXT = "ph_next";
const IDX = "ph_idx";
const H = 2 * 60 * 1000;

async function ensureInit() {
  if ((await AsyncStorage.getItem(NEXT)) == null)
    await AsyncStorage.setItem(NEXT, "0"); // desbloqueada
  if ((await AsyncStorage.getItem(IDX)) == null)
    await AsyncStorage.setItem(IDX, "0");
}

export async function getPhishingStatus() {
  await ensureInit();

  const now = Date.now();
  const next = Number((await AsyncStorage.getItem(NEXT)) ?? "0");
  const idx = Number((await AsyncStorage.getItem(IDX)) ?? "0");

  const ready = now >= next;
  const msRemaining = ready ? 0 : Math.max(0, next - now);

  const key = PHISHING_ORDER[idx % PHISHING_ORDER.length];
  const lesson = PHISHING_LESSONS[key];

  return { ready, msRemaining, lesson };
}

export async function consumePhishing() {
  await ensureInit();

  const now = Date.now();
  const idx = Number((await AsyncStorage.getItem(IDX)) ?? "0");

  await AsyncStorage.setItem(NEXT, String(now + H));
  await AsyncStorage.setItem(IDX, String(idx + 1));
}

export async function hasPhishingBadge() {
  const st = await getPhishingStatus();
  return st.ready;
}
export async function unlockPhishingNow(resetLesson = false) {
  await AsyncStorage.setItem(NEXT, "0");
  if (resetLesson) await AsyncStorage.setItem(IDX, "0");
}
