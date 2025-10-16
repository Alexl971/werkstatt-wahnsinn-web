import React from "react";

export default function Menu({ onStart, onSettings }) {
  return (
    <div style={styles.wrap}>
      <h1 style={styles.title}>⚙️ Werkstatt-Wahnsinn</h1>
      <p style={styles.subtitle}>
        Mini-Games · Reaktion · Quiz · schwarzer Humor
      </p>
      <button style={styles.primary} onClick={onStart}>
        🎮 Runde starten
      </button>
      <button style={styles.secondary} onClick={onSettings}>
        ⚙️ Einstellungen
      </button>
    </div>
  );
}

const styles = {
  wrap: {
    height: "100vh",
    backgroundColor: "#0f172a",
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    fontFamily: "system-ui, sans-serif",
  },
  title: { fontSize: "2.5rem", margin: 0 },
  subtitle: { fontSize: "1rem", opacity: 0.8, marginBottom: "1rem" },
  primary: {
    padding: "12px 24px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "1rem",
    cursor: "pointer",
  },
  secondary: {
    padding: "10px 20px",
    borderRadius: "12px",
    border: "2px solid #2563eb",
    backgroundColor: "transparent",
    color: "#2563eb",
    fontSize: "1rem",
    cursor: "pointer",
  },
};