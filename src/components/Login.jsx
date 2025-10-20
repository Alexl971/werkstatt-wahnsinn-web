// src/components/Login.jsx
import React, { useState } from "react";
import { signInLocal } from "../lib/auth";

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const u = signInLocal(username, pw);
    if (!u) return alert("Bitte Username & Passwort eingeben.");
    onSuccess(u);
  };

  return (
    <div style={styles.wrap}>
      <form onSubmit={submit} className="card" style={styles.card}>
        <h2 style={{ margin: 0 }}>Werkstatt-Wahnsinn</h2>
        <div style={{ color: "#cbd5e1", marginTop: 4 }}>Login</div>
        <input
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="Passwort"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          style={styles.input}
        />
        <button className="btn" style={styles.btnPrimary}>Anmelden</button>
        <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 8 }}>
          Admin-Button erscheint, wenn du als <b>Alex</b> angemeldet bist.
        </div>
      </form>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100svh",
    background: "#0f172a",
    display: "grid",
    placeItems: "center",
    color: "#e5e7eb",
    padding: 16,
  },
  card: {
    width: "min(440px, 100%)",
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 16,
    display: "grid",
    gap: 10,
  },
  input: {
    background: "#0b1220",
    border: "2px solid #1f2937",
    color: "#e5e7eb",
    padding: "10px 12px",
    borderRadius: 10,
    outline: "none",
  },
  btnPrimary: {
    background: "#2563eb",
    borderRadius: 12,
    border: "none",
    color: "#fff",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 800,
  },
};