// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, anon, {
  auth: { persistSession: false },
});

/** Add/Update: best score per (player_name, game_name). Visible = true. */
export async function addBestGameScore({ player_name, game_name, score, user_id = null }) {
  if (!player_name || !game_name || typeof score !== "number") {
    return { data: null, error: new Error("Missing fields") };
  }
  const { data: best, error: selErr } = await supabase
    .from("scores")
    .select("id, score")
    .eq("player_name", player_name)
    .eq("game_name", game_name)
    .order("score", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (selErr && selErr.code !== "PGRST116") return { data: null, error: selErr };

  if (best && best.score >= score) {
    return { data: best, error: null };
  }

  if (best) {
    return await supabase
      .from("scores")
      .update({ score, user_id, visible: true })
      .eq("id", best.id)
      .select()
      .single();
  } else {
    return await supabase
      .from("scores")
      .insert([{ player_name, game_name, score, user_id, visible: true }])
      .select()
      .single();
  }
}

/** Topliste: bester Score je Spieler für ein Spiel, optional Zeitraum in Tagen */
export async function fetchTopByGame(game_name, limit = 50, days = 7) {
  let q = supabase
    .from("scores_best_view")
    .select("player_name, game_name, score, created_at")
    .eq("game_name", game_name)
    .order("score", { ascending: false })
    .limit(limit);

  if (days) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    q = q.gte("created_at", since.toISOString());
  }

  let { data, error } = await q;
  if (!error && data) return { data, error: null };

  const { data: raw, error: e2 } = await supabase
    .from("scores")
    .select("player_name, game_name, score, created_at, visible")
    .eq("game_name", game_name)
    .eq("visible", true)
    .order("score", { ascending: false })
    .limit(2000);

  if (e2) return { data: null, error: e2 };

  const since = days
    ? new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    : null;

  const map = new Map();
  for (const r of raw || []) {
    if (since && new Date(r.created_at) < since) continue;
    const key = r.player_name?.trim() || "Anonymous";
    if (!map.has(key) || map.get(key).score < r.score) {
      map.set(key, r);
    }
  }
  const arr = Array.from(map.values()).sort((a, b) => b.score - a.score).slice(0, limit);
  return { data: arr, error: null };
}