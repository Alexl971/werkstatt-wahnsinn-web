import React, { useEffect, useRef, useState } from "react";

export default function Menu({
  onStart,
  onSettings,
  onHighscores,
  playerName,
  setPlayerName,
  highscore,
}) {
  const inputRef = useRef(null);
  const [showInstallHint, setShowInstallHint] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Fokus auf Namensfeld
    const t = setTimeout(() => inputRef.current?.focus?.(), 150);
    return () => clearTimeout(t);
  }, []);

  // PWA-Install-Hinweis-Logik
  useEffect(() => {
    const installed = window.matchMedia("(display-mode: standalone)").matches;
    if (installed) return; // App ist schon installiert

    // Prüfen, ob schon einmal gezeigt
    const seen = localStorage.getItem("PWA_HINT_SEEN");
    if (seen) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallHint(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Falls Safari / iOS, kein event -> trotzdem Hinweis anzeigen
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
      setTimeout(() => setShowInstallHint(true), 2000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstallHint(false);
        localStorage.setItem("PWA_HINT_SEEN", "1");
      }
    } else {
      // iOS Safari
      alert(
        "📲 Tippe auf das Teilen-Symbol (Quadrat mit Pfeil) und wähle 'Zum Home-Bildschirm hinzufügen'."
      );
      setShowInstallHint(false);
      localStorage.setItem("PWA_HINT_SEEN", "1");
    }
  };

  const canStart = playerName.trim().length > 0;
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && canStart) onStart();
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.logoBadge}>
          <div style={styles.logoCircle}>
            <span style={{ fontWeight: 900, letterSpacing: 1 }}>WW</span>
          </div>
        </div>

        <h1 style={styles.title}>Werkstatt-Wahnsinn</h1>
        <p style={styles.subtitle}>Mini-Games · Reaktion · Quiz · schwarzer Humor</p>

        <div style={{ width: "100%", maxWidth: 420 }}>
          <label htmlFor="playerName" style={styles.label}>
            Dein Name
          </label>
          <input
            id="playerName"
            ref={inputRef}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="z. B. Alex"
            autoComplete="name"
            style={styles.input}
          />
        </div>

        <div style={styles.actions}>
          <button
            className="btn"
            onClick={onStart}
            disabled={!canStart}
            style={{
              ...styles.btnPrimary,
              ...(canStart ? {} : styles.btnDisabled),
            }}
          >
            🎮 Runde starten
          </button>
          <button className="btn" onClick={onSettings} style={styles.btnSecondary}>
            ⚙️ Einstellungen
          </button>
          <button className="btn" onClick={onHighscores} style={styles.btnGhost}>
            🏆 Highscores
          </button>
        </div>

        <div style={styles.infoBar}>
          <div>
            <span style={styles.infoLabel}>Highscore lokal:</span>{" "}
            <b>{highscore ?? 0}</b>
          </div>
          <div style={styles.dot} />
          <div>🕒 Rundenlänge: <b>20 s</b> (fix)</div>
        </div>
      </div>

      {showInstallHint && (
        <div style={styles.installHint}>
          <p style={{ margin: 0 }}>
            📱 <b>Zum Home-Bildschirm hinzufügen</b>
          </p>
          <button style={styles.installBtn} onClick={handleInstall}>
            Jetzt hinzufügen
          </button>
          <button
            style={styles.closeBtn}
            onClick={() => {
              setShowInstallHint(false);
              localStorage.setItem("PWA_HINT_SEEN", "1");
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div style={styles.footer}>
        <span style={{ opacity: 0.8 }}>Vite + React · PWA</span>
        <span style={{ opacity: 0.5 }}>© {new Date().getFullYear()} Werkstatt-Wahnsinn</span>
      </div>
    </div>
  );
}

/* ========== Styles ========== */
const styles = {
  wrap: {
    minHeight: "100%",
    display: "grid",
    gridTemplateRows: "1fr auto",
    alignItems: "center",
    justifyItems: "center",
    gap: 18,
    padding: 16,
    background:
      "radial-gradient(1200px 600px at 50% -10%, rgba(37,99,235,0.12), transparent 60%)",
  },
  card: {
    width: "100%",
    maxWidth: 560,
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 22,
    padding: 20,
    display: "grid",
    justifyItems: "center",
    gap: 14,
    color: "#e5e7eb",
    boxShadow: "0 10px 30px rgba(0,0,0,.25)",
  },
  logoBadge: { marginTop: 8 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(150deg, #34d399 0%, #22d3ee 55%, #3b82f6 100%)",
    color: "#0b1220",
    fontSize: 22,
    border: "2px solid #1f2937",
    boxShadow: "0 6px 20px rgba(59,130,246,.25)",
  },
  title: {
    margin: 0,
    marginTop: 4,
    fontSize: 34,
    textAlign: "center",
    fontWeight: 900,
  },
  subtitle: { margin: 0, color: "#cbd5e1", textAlign: "center" },
  label: { fontSize: 13, color: "#9ca3af", marginBottom: 6, display: "block" },
  input: {
    width: "100%",
    background: "#0b1220",
    border: "2px solid #1f2937",
    color: "#e5e7eb",
    padding: "12px 14px",
    borderRadius: 12,
    outline: "none",
    fontSize: 16,
  },
  actions: {
    width: "100%",
    maxWidth: 420,
    display: "grid",
    gap: 10,
    marginTop: 6,
  },
  btnPrimary: {
    background: "#2563eb",
    borderRadius: 12,
    border: "none",
    color: "white",
    padding: "14px 16px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 16,
  },
  btnSecondary: {
    background: "#334155",
    borderRadius: 12,
    border: "none",
    color: "#e5e7eb",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 800,
  },
  btnGhost: {
    background: "#0b1220",
    borderRadius: 12,
    border: "2px solid #1f2937",
    color: "#e5e7eb",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 800,
  },
  btnDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
    filter: "grayscale(25%)",
  },
  infoBar: {
    width: "100%",
    maxWidth: 420,
    marginTop: 6,
    padding: "10px 12px",
    borderRadius: 14,
    border: "2px solid #1f2937",
    background: "#0b1220",
    display: "flex",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    color: "#cbd5e1",
  },
  infoLabel: { opacity: 0.85, marginRight: 4 },
  dot: { width: 6, height: 6, borderRadius: 999, background: "#334155" },
  footer: {
    width: "100%",
    maxWidth: 560,
    display: "flex",
    justifyContent: "space-between",
    color: "#9ca3af",
    fontSize: 12,
    padding: "0 6px",
  },
  installHint: {
    position: "fixed",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(17, 24, 39, 0.95)",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#e5e7eb",
    boxShadow: "0 6px 20px rgba(0,0,0,.35)",
    backdropFilter: "blur(8px)",
    zIndex: 100,
  },
  installBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "8px 12px",
    fontWeight: 700,
    cursor: "pointer",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#9ca3af",
    fontSize: 18,
    cursor: "pointer",
  },
};