import React from "react";

/**
 * Props:
 * - onStart()
 * - onSettings()
 * - onHighscores()
 * - highscore: number
 * - username: string
 */
export default function Menu({
  onStart,
  onSettings,
  onHighscores,
  highscore,
  username,
}) {
  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        {/* Kopf */}
        <div style={styles.header}>
          <div style={styles.logoGlow} />
          <div style={styles.logo}>WW</div>
          <div>
            <h1 style={styles.title}>Werkstatt-Wahnsinn</h1>
            <div style={styles.subtitle}>
              Mini-Games · Reaktion · Quiz · schwarzer Humor
            </div>
          </div>
        </div>

        {/* CTAs */}
        <button className="btn" style={styles.btnPrimary} onClick={onStart}>
          🎮 Runde starten
        </button>
        <button className="btn" style={styles.btnSecondary} onClick={onSettings}>
          ⚙️ Einstellungen
        </button>
        <button className="btn" style={styles.btnGhost} onClick={onHighscores}>
          🏆 Highscores
        </button>

        {/* Info-Zeile */}
        <div style={styles.infoBox}>
          <span style={styles.infoLabel}>User:</span>
          <b>{username}</b>
          <span style={styles.dot} />
          <span style={styles.infoLabel}>Highscore lokal:</span>
          <b>{highscore ?? 0}</b>
          <span style={styles.dot} />
          <span style={styles.infoLabel}>Rundenlänge: 20 s (fix)</span>
        </div>
      </div>

      <div style={styles.footer}>
        <span>Vite + React · PWA</span>
        <span>© 2025 Werkstatt-Wahnsinn</span>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100svh",
    display: "grid",
    gridTemplateRows: "1fr auto",
    alignItems: "center",
    justifyItems: "start",
    background: "#0f172a",
    padding: "calc(16px + env(safe-area-inset-top)) 24px calc(20px + env(safe-area-inset-bottom)) 24px",
    color: "#e5e7eb",
    backgroundImage:
      "radial-gradient(1200px 600px at 40% -10%, rgba(37,99,235,.10), transparent 60%)",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  },

  card: {
    width: "min(720px, 100%)",
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: "20px 22px",
    boxShadow: "0 8px 25px rgba(0,0,0,.35)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 6,
    position: "relative",
  },
  logoGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 24,
    left: -20,
    top: -10,
    background:
      "radial-gradient(circle at 30% 30%, rgba(59,130,246,.35), transparent 60%), radial-gradient(circle at 70% 70%, rgba(16,185,129,.35), transparent 55%)",
    filter: "blur(8px)",
    zIndex: 0,
  },
  logo: {
    position: "relative",
    width: 72,
    height: 72,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    color: "#0b1220",
    letterSpacing: 1,
    background: "linear-gradient(135deg, #34d399 0%, #60a5fa 55%, #2563eb 100%)",
    boxShadow: "0 6px 20px rgba(37,99,235,.35)",
    zIndex: 1,
  },

  title: {
    margin: "0 0 4px 0",
    fontSize: "clamp(26px, 5vw, 38px)",
    lineHeight: 1.1,
    fontWeight: 900,
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: "clamp(14px, 3.2vw, 17px)",
  },

  btnPrimary: {
    background: "#2563eb",
    borderRadius: 12,
    border: "none",
    color: "white",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700,
    width: "100%",
  },
  btnSecondary: {
    background: "#334155",
    borderRadius: 12,
    border: "none",
    color: "#e5e7eb",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700,
    width: "100%",
  },
  btnGhost: {
    background: "transparent",
    borderRadius: 12,
    border: "2px solid #1f2937",
    color: "#e5e7eb",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700,
    width: "100%",
  },

  infoBox: {
    marginTop: 4,
    borderRadius: 12,
    border: "2px solid #1f2937",
    background: "#0b1220",
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  infoLabel: { color: "#cbd5e1" },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#64748b",
    display: "inline-block",
  },

  footer: {
    width: "100%",
    maxWidth: 720,
    display: "flex",
    justifyContent: "space-between",
    color: "#94a3b8",
    fontSize: 12,
    paddingTop: 12,
    opacity: 0.9,
  },
};