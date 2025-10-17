// src/lib/supabase-best.js
import { supabase } from "./supabase";

/** Top je Spieler (beste Punktzahl) filtriert nach Spiel */
export async function fetchTopByGame(game, limit = 50) {
  let q = supabase
    .from("scores")
    .select("player_name, game_name, value, user_id, created_at")
    .eq("game_name", game);

  const { data, error } = await q;
  if (error) return { data: null, error };

  // best-of pro (user_id, player_name)
  const best = new Map();
  for (const row of data) {
    const key = (row.user_id || "") + "|" + (row.player_name || "");
    if (!best.has(key) || row.value > best.get(key).value) best.set(key, row);
  }
  const arr = Array.from(best.values())
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map(r => ({ player_name: r.player_name, score: r.value }));

  return { data: arr, error: null };
}

/** Best-Score pro {user_id, game} nur erhöhen */
export async function addBestGameScore(playerName, game, value, user) {
  const user_id = user?.id ?? null;

  // aktuellen Bestwert (für diesen User & dieses Spiel) holen
  const { data: cur, error: e1 } = await supabase
    .from("scores")
    .select("id, value")
    .eq("game_name", game)
    .eq("user_id", user_id)
    .order("value", { ascending: false })
    .limit(1);

  if (e1) return { error: e1 };

  if (cur && cur.length && cur[0].value >= value) {
    return { data: { skipped: true }, error: null };
  }

  const { data, error } = await supabase.from("scores").insert([
    {
      player_name: playerName || "Anonymous",
      game_name: game,
      value,
      user_id,
    },
  ]);

  return { data, error };
}