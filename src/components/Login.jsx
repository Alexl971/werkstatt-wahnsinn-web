// src/components/Login.jsx
import React, { useState } from "react";
import { signIn, signUp } from "../lib/auth";

export default function Login({ onSuccess }) {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg("");
    const fn = mode === "login" ? signIn : signUp;
    const { user, error } = await fn(username, password);
    setBusy(false);
    if (error) { setMsg(error); return; }
    onSuccess(user);
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.logo}>WW</div>
        <h1 style={styles.title}>Anmelden</h1>
        <div style={styles.subtitle}>Bitte melde dich an, um zu spielen.</div>

        <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
          <label style={styles.label}>Benutzername</label>
          <input
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="z. B. Alex"
            autoComplete="username"
          />
          <label style={styles.label}>Passwort</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />

          {msg && <div style={styles.error}>{msg}</div>}

          <button className="btn" style={styles.btnPrimary} disabled={busy}>
            {busy ? "Bitte warten…" : (mode === "login" ? "Einloggen" : "Registrieren")}
          </button>
        </form>

        <div style={styles.switchRow}>
          {mode === "login" ? (
            <>
              <span>Noch kein Account?</span>
              <button style={styles.linkBtn} onClick={() => setMode("signup")}>Registrieren</button>
            </>
          ) : (
            <>
              <span>Schon einen Account?</span>
              <button style={styles.linkBtn} onClick={() => setMode("login")}>Einloggen</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100svh",
    display: "grid",
    placeItems: "center",
    padding:
      "calc(16px + env(safe-area-inset-top)) 16px calc(20px + env(safe-area-inset-bottom)) 16px",
    background: "#0f172a",
    color: "#e5e7eb",
  },
  card: {
    width: "min(420px, 100%)",
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 18,
  },
  logo: {
    width: 64, height: 64, borderRadius: 16, margin: "4px auto 8px",
    display: "grid", placeItems: "center",
    fontWeight: 900, color: "#0b1220",
    background: "linear-gradient(135deg,#34d399 0%, #60a5fa 55%, #2563eb 100%)",
  },
  title: { margin: "0 0 4px 0", textAlign: "center", fontSize: 28, fontWeight: 900 },
  subtitle: { textAlign: "center", color: "#cbd5e1", marginBottom: 12 },
  label: { fontSize: 13, color: "#cbd5e1" },
  input: {
    background: "#0b1220", border: "2px solid #1f2937", color: "#e5e7eb",
    padding: "10px 12px", borderRadius: 10, outline: "none",
  },
  error: { background: "#7f1d1d", border: "1px solid #991b1b", padding: 8, borderRadius: 8 },
  btnPrimary: {
    marginTop: 6,
    background: "#2563eb", color: "#fff", border: "none",
    borderRadius: 12, padding: "12px 14px", fontWeight: 800, cursor: "pointer",
  },
  switchRow: { marginTop: 12, display: "flex", gap: 8, justifyContent: "center", color: "#cbd5e1" },
  linkBtn: { background: "transparent", border: "none", color: "#60a5fa", cursor: "pointer", fontWeight: 700 },
};