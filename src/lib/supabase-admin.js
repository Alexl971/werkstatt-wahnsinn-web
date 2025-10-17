// src/lib/supabase-admin.js
import { supabase } from "./supabase";

/** Alle Scores (optional: pro Spiel), inkl. invisible, für Admin-Tabelle */
export async function adminListScores({ game = null, limit = 500 } = {}) {
  let q = supabase
    .from("scores")
    .select("id, player_name, game_name, score, user_id, created_at, visible")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (game) q = q.eq("game_name", game);

  return q;
}

/** Ein Score-Eintrag sicht-/unsichtbar schalten */
export async function adminSetVisible(id, visible) {
  return supabase
    .from("scores")
    .update({ visible })
    .eq("id", id);
}

/** Alle Scores eines Spiels ausblenden (soft reset) */
export async function adminHideGame(game) {
  return supabase
    .from("scores")
    .update({ visible: false })
    .eq("game_name", game)
    .eq("visible", true);
}