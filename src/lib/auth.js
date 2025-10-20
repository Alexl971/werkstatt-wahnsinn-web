// src/lib/auth.js
const KEY = "WW_USER";

export function getAuthUser() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export function signInLocal(username, password) {
  if (!username?.trim() || !password?.trim()) return null;
  const user = { id: crypto.randomUUID(), username: username.trim() };
  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

export function signOutLocal() {
  localStorage.removeItem(KEY);
}