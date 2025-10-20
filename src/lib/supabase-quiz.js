// src/lib/supabase-quiz.js
import { supabase } from "./supabase";

/** Liste aller (optional: nur sichtbare), mit Client-Suche */
export async function listQuestions({ onlyVisible = false, search = "", limit = 2000 } = {}) {
  let q = supabase
    .from("quiz_questions")
    .select("id, question, answers, correct_index, visible, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (onlyVisible) q = q.eq("visible", true);

  const { data, error } = await q;
  if (error) return { data: null, error };

  if (search?.trim()) {
    const s = search.trim().toLowerCase();
    const filtered = data.filter(r =>
      (r.question || "").toLowerCase().includes(s) ||
      JSON.stringify(r.answers || []).toLowerCase().includes(s)
    );
    return { data: filtered, error: null };
  }
  return { data, error: null };
}

/** Zufällige sichtbare Frage holen */
export async function getRandomVisibleQuestion() {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("id, question, answers, correct_index")
    .eq("visible", true)
    .limit(1000);
  if (error) return { data: null, error };
  if (!data?.length) return { data: null, error: null };
  const pick = data[Math.floor(Math.random() * data.length)];
  return { data: pick, error: null };
}

/** CRUD */
export async function createQuestion({ question, answers, correct_index, visible = true }) {
  return supabase.from("quiz_questions").insert([{ question, answers, correct_index, visible }]);
}

export async function updateQuestion(id, patch) {
  return supabase.from("quiz_questions").update(patch).eq("id", id);
}

export async function setQuestionVisible(id, visible) {
  return updateQuestion(id, { visible });
}

export async function deleteQuestion(id) {
  return supabase.from("quiz_questions").delete().eq("id", id);
}