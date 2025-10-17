import { createClient } from "@supabase/supabase-js";

const url  = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.warn("[supabase-best] ENV fehlt. VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY nicht gesetzt?");
}

export const supabase = createClient(url || "", anon || "");

/** Nur bester Score pro Spieler+Spiel */
export async function addBestGameScore({ name, game, points }) {
  const player = String(name || "").trim().slice(0, 24);
  const g = String(game || "").trim();
  const p = Number(points);
  if (!player || !g || !Number.isFinite(p) || p < 0) {
    return { error: new Error("invalid_args") };
  }

  const { data: best, error: readErr } = await supabase
    .from("scores") // <- deine Tabelle
    .select("id, score")
    .eq("player_name", player)
    .eq("game_name", g)
    .order("score", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (readErr) return { error: readErr };

  if (!best || p > (best?.score ?? -1)) {
    const { data, error } = await supabase
      .from("scores")
      .insert([{ player_name: player, game_name: g, score: p }])
      .select()
      .single();
    return { data, error };
  }
  return { data: best, skipped: true };
}

/** Topliste pro Spiel (dedupliziert auf besten pro Spieler) */
export async function fetchTopByGame(game, limit = 50) {
  const g = String(game || "").trim();
  if (!g) return { data: [], error: new Error("no_game") };

  const { data, error } = await supabase
    .from("scores")
    .select("player_name, score, created_at")
    .eq("game_name", g)
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(500);

  if (error) return { data: [], error };

  const seen = new Set();
  const unique = [];
  for (const row of data || []) {
    const key = (row.player_name || "").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(row);
    if (unique.length >= limit) break;
  }
  return { data: unique, error: null };
}