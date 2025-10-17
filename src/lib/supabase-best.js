// src/lib/supabase-best.js
import { supabase } from "./supabase";

/** Top je Spieler (beste Punktzahl) gefiltert nach Spiel */
export async function fetchTopByGame(game, limit = 50) {
  const { data, error } = await supabase
    .from("scores")
    .select("player_name, game_name, score, user_id, created_at")
    .eq("game_name", game);

  if (error) return { data: null, error };

  // best-of pro (user_id, player_name)
  const best = new Map();
  for (const row of data) {
    const key = (row.user_id || "") + "|" + (row.player_name || "");
    if (!best.has(key) || row.score > best.get(key).score) best.set(key, row);
  }

  const arr = Array.from(best.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => ({ player_name: r.player_name, score: r.score }));

  return { data: arr, error: null };
}

/** Best-Score pro {user_id, game} nur erhöhen */
export async function addBestGameScore(playerName, game, value, user) {
  const user_id = user?.id ?? null;

  // aktuellen Bestwert (für diesen User & dieses Spiel) holen
  const { data: cur, error: e1 } = await supabase
    .from("scores")
    .select("id, score")
    .eq("game_name", game)
    .eq("user_id", user_id)
    .order("score", { ascending: false })
    .limit(1);

  if (e1) return { error: e1 };

  if (cur && cur.length && cur[0].score >= value) {
    return { data: { skipped: true }, error: null };
  }

  // neuen Score eintragen (Spaltenname = score)
  const { data, error } = await supabase.from("scores").insert([
    {
      player_name: playerName || "Anonymous",
      game_name: game,
      score: value,       // <— wichtig: score, nicht value
      user_id,
    },
  ]);

  return { data, error };
}