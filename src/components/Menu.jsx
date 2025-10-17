import React from "react";

export default function Menu({
  onStart,
  onSettings,
  onHighscores,
  playerName,
  setPlayerName,
  highscore,
}) {
  return (
    <div style={styles.page}>
      <div style={styles.heroCard}>
        {/* Icon-Badge */}
        <div style={styles.iconBadge}>
          <span style={{ fontWeight: 900 }}>WW</span>
        </div>

        {/* Titel & Claim */}
        <h1 style={styles.title}>Werkstatt-Wahnsinn</h1>
        <p style={styles.subtitle}>Mini-Games · Reaktion · Quiz · schwarzer Humor</p>

        {/* Name + Buttons */}
        <div style={{ width: "100%", maxWidth: 420, marginTop: 8 }}>
          <input
            style={styles.input}
            placeholder="Spielername"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <div style={styles.buttonRow}>
            <button style={styles.primary} onClick={onStart}>🎮 Runde starten</button>
            <button style={styles.secondary} onClick={onSettings}>⚙️ Einstellungen</button>
            <button style={styles.tertiary} onClick={onHighscores}>🏆 Highscores</button>
          </div>

          {/* Info-Leiste */}
          <div style={styles.infoBar}>
            <div><span style={styles.infoLabel}>Highscore lokal:</span> {highscore}</div>
            <div style={{ opacity: .75 }}>Dark-Mode aktiv</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span>⚙️ Vite + React · PWA</span>
        <span>© {new Date().getFullYear()} Werkstatt-Wahnsinn</span>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 16,
    background:
      "radial-gradient(1200px 500px at 20% 0%, rgba(37,99,235,.25), transparent 60%), radial-gradient(1200px 500px at 100% 100%, rgba(34,197,94,.18), transparent 60%), #0f172a",
    color: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCard: {
    width: "100%",
    maxWidth: 720,
    background: "rgba(17,24,39,.85)",
    backdropFilter: "blur(6px)",
    border: "2px solid #1f2937",
    borderRadius: 20,
    padding: 24,
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,.35)",
  },
  iconBadge: {
    width: 72, height: 72,
    margin: "0 auto 8px",
    borderRadius: 16,
    background:
      "conic-gradient(from 180deg at 50% 50%, #2563eb, #22c55e, #2563eb)",
    display: "grid",
    placeItems: "center",
    color: "#0f172a",
    fontSize: 22,
  },
  title: { margin: "6px 0 2px", fontSize: 34, fontWeight: 900, letterSpacing: .2 },
  subtitle: { margin: 0, opacity: .85 },
  input: {
    width: "100%",
    marginTop: 14,
    background: "#0b1220",
    border: "2px solid #1f2937",
    color: "#e5e7eb",
    padding: "12px 14px",
    borderRadius: 12,
    outline: "none",
    fontSize: 16,
  },
  buttonRow: {
    display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap",
    justifyContent: "center",
  },
  primary: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: 800,
  },
  secondary: {
    background: "#334155",
    color: "#e5e7eb",
    border: "none",
    borderRadius: 12,
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: 800,
  },
  tertiary: {
    background: "#0b1220",
    color: "#e5e7eb",
    border: "2px solid #1f2937",
    borderRadius: 12,
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: 800,
  },
  infoBar: {
    marginTop: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    background: "#0b1220",
    border: "2px solid #1f2937",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 14,
  },
  infoLabel: { opacity: .75, marginRight: 6 },
  footer: {
    position: "fixed",
    bottom: 10,
    left: 0, right: 0,
    margin: "0 auto",
    width: "100%",
    maxWidth: 720,
    display: "flex",
    justifyContent: "space-between",
    padding: "0 12px",
    opacity: .6,
    fontSize: 12,
    pointerEvents: "none",
  },
};