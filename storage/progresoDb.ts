// src/storage/progresoDb.ts
// Lógica BD: racha + completar nivel perfecto (+xp, +nivel) + reset test

import { getSupabase } from "@/service/supabase";

export async function syncStreakDb() {
  const supabase = getSupabase();
  const { error } = await supabase.rpc("sync_streak");
  if (error) throw error;
}

// ✅ retorna true si aplicó (subió xp/nivel), false si NO aplicó (ej: p_level != nivel actual)
export async function completeLevelPerfectDb(levelId: number, xp: number) {
  const supabase = getSupabase();

  const { data: u } = await supabase.auth.getUser();
  const uid = u.user!.id;

  const { data, error } = await supabase.rpc("complete_level_perfect", {
    p_level: levelId,
    p_xp: xp,
  });
  if (error) throw error;

  const { data: prof2 } = await supabase
    .from("profiles")
    .select("xp, nivel, racha, last_play_date")
    .eq("id", uid)
    .single();

  console.log("AFTER RPC:", prof2);
  return Boolean(data);
}

export async function resetProfileProgressDb() {
  const supabase = getSupabase();
  const { error } = await supabase.rpc("reset_profile_progress");
  if (error) throw error;
}
