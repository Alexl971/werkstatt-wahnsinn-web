import { createClient } from "@supabase/supabase-js";

const url  = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, anon);

/**
 * Speichert nur, wenn der neue Score besser ist als der bisherige
 * (pro Spieler + Spiel). Tabelle: public.scores(player_name, game_name, score, created_at)
 */
export async function addBestGameScore({ name, game, points }) {
  const player = String(name || "").trim().slice(0, 24);
  const g = String(game || "").trim();
  const p = Number(points);

  if (!player || !g || !Number.isFinite(p) || p < 0) {
    return { error: "invalid_args" };
  }

  // aktuellen Bestwert holen
  const { data: best, error: readErr } = await supabase
    .from("scores")
    .select("id, score")
    .eq("player_name", player)
    .eq("game_name", g)
    .order("score", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (readErr) console.warn("supabase read error", readErr);

  // nur speichern, wenn besser
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

/**
 * Topliste für EIN Spiel (dedupliziert auf „bester pro Spieler“).
 */
export async function fetchTopByGame(game, limit = 50) {
  const g = String(game || "").trim();
  if (!g) return { data: [], error: null };

  const { data, error } = await supabase
    .from("scores")
    .select("player_name, score, created_at")
    .eq("game_name", g)
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(500);

  if (error) return { data: [], error };

  // Dedupe: pro Spieler nur der erste (beste) Eintrag
  const seen = new Set();
  const unique = [];
  for (const row of data) {
    const key = row.player_name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(row);
    if (unique.length >= limit) break;
  }
  return { data: unique, error: null };
}