import { createClient } from '@supabase/supabase-js';

// Diese Variablen kommen aus Netlify (Site Settings → Environment variables)
// und lokal aus einer .env-Datei (Vite liest VITE_* Variablen automatisch).
const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, anon);

// Score speichern
export async function addScore({ name, points }) {
  if (!name || !points || points < 0) return { error: 'invalid' };
  const { data, error } = await supabase.from('scores').insert([{ name, points }]).select().single();
  return { data, error };
}

// Top-Liste holen
export async function fetchTop(limit = 50) {
  const { data, error } = await supabase
    .from('scores')
    .select('id,name,points,created_at')
    .order('points', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(limit);
  return { data, error };
}