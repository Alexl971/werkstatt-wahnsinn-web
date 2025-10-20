// src/components/Menu.jsx
import React from "react";

export default function Menu({ onStart, onSettings, onHighscores, highscore, username }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.hero}>
        <div style={styles.badge}>Mini-Games · Reaktion · Quiz · schwarzer Humor</div>
        <h1 style={styles.title}>⚙️ Werkstatt-Wahnsinn</h1>
        <p style={styles.sub}>Willkommen, <b>{username}</b>! Viel Spaß bei der Schicht… äh… Schikane 😄</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn" style={styles.btnPrimary} onClick={onStart}>Runde starten</button>
          <button className="btn" style={styles.btnSecondary} onClick={onHighscores}>🏆 Highscores</button>
          <button className="btn" style={styles.btnGhost} onClick={onSettings}>Einstellungen</button>
        </div>
        <div style={styles.info}>Highscore (lokal): <b>{highscore}</b></div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    padding: 16,
    display: "grid",
    justifyItems: "start", // linkszentriert
  },
  hero: {
    width: "min(760px, 100%)",
    padding: 16,
    display: "grid",
    gap: 12,
  },
  badge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    background: "#0b1220",
    border: "2px solid #1f2937",
    color: "#93c5fd",
    fontWeight: 800,
    fontSize: 12,
  },
  title: { fontSize: 32, margin: "6px 0 0 0" },
  sub: { color: "#cbd5e1", margin: 0 },
  btnPrimary: { background: "#2563eb", borderRadius: 12, border: "none", color: "#fff", padding: "12px 16px", cursor: "pointer", fontWeight: 800 },
  btnSecondary: { background: "#334155", borderRadius: 12, border: "none", color: "#e5e7eb", padding: "12px 16px", cursor: "pointer", fontWeight: 800 },
  btnGhost: { background: "#0b1220", borderRadius: 12, border: "2px solid #1f2937", color: "#e5e7eb", padding: "12px 16px", cursor: "pointer", fontWeight: 800 },
  info: { color: "#94a3b8" },
};