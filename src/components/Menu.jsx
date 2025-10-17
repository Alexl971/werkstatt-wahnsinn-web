// src/components/Menu.jsx
import React from "react";

/**
 * Props:
 * - onStart(): void
 * - onSettings(): void
 * - onHighscores(): void
 * - playerName: string
 * - setPlayerName(v: string): void
 * - highscore: number
 */
export default function Menu({
  onStart,
  onSettings,
  onHighscores,
  playerName,
  setPlayerName,
  highscore,
}) {
  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        {/* Logo / App-Icon */}
        <div style={styles.logoWrap}>
          <div style={styles.logoGlow} />
          <div style={styles.logo}>WW</div>
        </div>

        <h1 style={styles.title}>Werkstatt-Wahnsinn</h1>
        <div style={styles.subtitle}>Mini-Games · Reaktion · Quiz · schwarzer Humor</div>

        {/* Name */}
        <label style={styles.label} htmlFor="playerName">
          Dein Name
        </label>
        <input
          id="playerName"
          placeholder="Spielername"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          style={styles.input}
        />

        {/* CTAs */}
        <button className="btn" style={styles.btnPrimary} onClick={onStart}>
          🎮&nbsp;Runde starten
        </button>
        <button className="btn" style={styles.btnSecondary} onClick={onSettings}>
          ⚙️&nbsp;Einstellungen
        </button>
        <button className="btn" style={styles.btnGhost} onClick={onHighscores}>
          🏆&nbsp;Highscores
        </button>

        {/* Info-Footer in der Karte */}
        <div style={styles.infoBox}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Highscore lokal:</span>
            <span style={styles.infoValue}>{highscore ?? 0}</span>
            <span style={styles.dot} />
            <span style={styles.clock}>🕓</span>
            <span style={styles.infoLabel}>
              Rundenlänge: <b>20&nbsp;s</b> (fix)
            </span>
          </div>
        </div>
      </div>

      {/* Page-Footer */}
      <div style={styles.footer}>
        <span>Vite + React · PWA</span>
        <span>© 2025 Werkstatt-Wahnsinn</span>
      </div>
    </div>
  );
}

const styles = {
  /* Vollflächig, wirklich zentriert, mit safe-area */
  wrap: {
    minHeight: "100svh",
    padding:
      "calc(16px + env(safe-area-inset-top)) 16px calc(20px + env(safe-area-inset-bottom)) 16px",
    display: "grid",
    gridTemplateRows: "1fr auto",
    alignItems: "center",
    justifyItems: "center",
    background: "#0f172a",
    color: "#e5e7eb",
    backgroundImage:
      "radial-gradient(1200px 600px at 50% -10%, rgba(37,99,235,.10), transparent 60%)",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  },

  /* Karte */
  card: {
    width: "min(720px, calc(100vw - 32px))",
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: "20px 18px 18px",
    boxShadow: "0 10px 40px rgba(0,0,0,.25)",
  },

  /* Logo */
  logoWrap: { position: "relative", display: "grid", placeItems: "center", marginBottom: 8 },
  logoGlow: {
    position: "absolute",
    width: 104,
    height: 104,
    borderRadius: 24,
    background:
      "radial-gradient(circle at 30% 30%, rgba(59,130,246,.35), transparent 60%), radial-gradient(circle at 70% 70%, rgba(16,185,129,.35), transparent 55%)",
    filter: "blur(8px)",
  },
  logo: {
    position: "relative",
    width: 84,
    height: 84,
    borderRadius: 20,
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    color: "#0b1220",
    letterSpacing: 1,
    background:
      "linear-gradient(135deg, #34d399 0%, #60a5fa 55%, #2563eb 100%)",
    boxShadow: "0 8px 22px rgba(37,99,235,.35)",
    margin: "0 auto",
  },

  title: {
    margin: "4px 0 6px 0",
    fontSize: "clamp(28px, 6vw, 44px)",
    lineHeight: 1.1,
    fontWeight: 900,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#cbd5e1",
    marginBottom: 14,
    fontSize: "clamp(14px, 3.2vw, 18px)",
  },

  label: {
    display: "block",
    margin: "6px 0 6px 4px",
    fontSize: 14,
    color: "#cbd5e1",
  },
  input: {
    width: "100%",
    background: "#0b1220",
    border: "2px solid #1f2937",
    color: "#e5e7eb",
    padding: "12px 14px",
    borderRadius: 12,
    outline: "none",
    fontSize: 16,
    marginBottom: 12,
  },

  btnPrimary: {
    width: "100%",
    background: "#2563eb",
    borderRadius: 14,
    border: "none",
    color: "white",
    padding: "14px 16px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 18,
    boxShadow: "0 6px 18px rgba(37,99,235,.35)",
    marginTop: 2,
  },
  btnSecondary: {
    width: "100%",
    background: "#374151",
    borderRadius: 14,
    border: "none",
    color: "#e5e7eb",
    padding: "14px 16px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 18,
    marginTop: 10,
  },
  btnGhost: {
    width: "100%",
    background: "transparent",
    borderRadius: 14,
    border: "2px solid #1f2937",
    color: "#e5e7eb",
    padding: "14px 16px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 18,
    marginTop: 10,
  },

  infoBox: {
    marginTop: 14,
    borderRadius: 16,
    border: "2px solid #1f2937",
    background: "#0b1220",
    padding: "12px 14px",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  infoLabel: { color: "#cbd5e1" },
  infoValue: { fontWeight: 900, color: "#e5e7eb", minWidth: 24, textAlign: "right" },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    background: "#64748b",
    display: "inline-block",
  },
  clock: { filter: "grayscale(.2)" },

  footer: {
    width: "100%",
    maxWidth: 720,
    display: "flex",
    justifyContent: "space-between",
    color: "#94a3b8",
    fontSize: 12,
    paddingTop: 10,
    opacity: 0.9,
  },
};