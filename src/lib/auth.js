// src/lib/auth.js
import { supabase } from "./supabase";
import bcrypt from "bcryptjs";

const AUTH_KEY = "AUTH_USER";

/** aktuell eingeloggter Benutzer aus localStorage */
export function getAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function signOutLocal() {
  localStorage.removeItem(AUTH_KEY);
}

/** Registrierung: Benutzername muss eindeutig sein */
export async function signUp(username, password) {
  const uname = (username || "").trim();
  if (!uname || !password || password.length < 4) {
    return { error: "Bitte Benutzername und ein Passwort (min. 4 Zeichen) eingeben." };
  }

  // existiert schon?
  const { data: exists, error: e1 } = await supabase
    .from("users_custom")
    .select("id")
    .eq("username", uname)
    .limit(1);
  if (e1) return { error: e1.message };
  if (exists && exists.length) return { error: "Benutzername ist bereits vergeben." };

  const pass_hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from("users_custom")
    .insert([{ username: uname, pass_hash }])
    .select()
    .single();
  if (error) return { error: error.message };

  const user = { id: data.id, username: data.username };
  setAuthUser(user);
  return { user };
}

/** Anmeldung: Username + Passwort prüfen */
export async function signIn(username, password) {
  const uname = (username || "").trim();
  if (!uname || !password) return { error: "Bitte Benutzername und Passwort eingeben." };

  const { data, error } = await supabase
    .from("users_custom")
    .select("id, username, pass_hash")
    .eq("username", uname)
    .limit(1)
    .single();

  if (error || !data) return { error: "Benutzer nicht gefunden." };

  const ok = await bcrypt.compare(password, data.pass_hash);
  if (!ok) return { error: "Passwort ist falsch." };

  const user = { id: data.id, username: data.username };
  setAuthUser(user);
  return { user };
}