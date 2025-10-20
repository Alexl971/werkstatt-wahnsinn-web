// src/lib/supabase-admin.js
import { supabase } from "./supabase";

/** Date Filter helper */
function applyDateFilter(query, days) {
  if (!days) return query;
  const since = new Date();
  since.setDate(since.getDate() - days);
  return query.gte("created_at", since.toISOString());
}

/** Scores laden (optional: game, days, visible), inkl. unsichtbare */
export async function adminListScores({
  game = null,
  days = null,          // 7 | 30 | null=alle
  visible = "all",      // "all" | true | false
  limit = 2000,
} = {}) {
  let q = supabase
    .from("scores")
    .select("id, player_name, game_name, score, user_id, created_at, visible")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (game) q = q.eq("game_name", game);
  if (visible !== "all") q = q.eq("visible", !!visible);
  q = applyDateFilter(q, days);

  return q;
}

export async function adminSetVisible(id, visible) {
  return supabase.from("scores").update({ visible }).eq("id", id);
}

export async function adminBulkVisible(ids, visible) {
  if (!ids.length) return { data: null, error: null };
  return supabase.from("scores").update({ visible }).in("id", ids);
}

export async function adminDeleteScores(ids) {
  if (!ids.length) return { data: null, error: null };
  return supabase.from("scores").delete().in("id", ids);
}

export async function adminHideGame(game) {
  return supabase.from("scores").update({ visible: false }).eq("game_name", game).eq("visible", true);
}

/** Users */
export async function adminListUsers({ limit = 1000 } = {}) {
  return supabase
    .from("users_custom")
    .select("id, username, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
}

export async function adminHideUserScores(user_id) {
  return supabase.from("scores").update({ visible: false }).eq("user_id", user_id).eq("visible", true);
}

export async function adminAnonymizeUserScores(user_id) {
  return supabase
    .from("scores")
    .update({ player_name: "Anonymous", user_id: null })
    .eq("user_id", user_id);
}

export async function adminDeleteUser(user_id) {
  return supabase.from("users_custom").delete().eq("id", user_id);
}