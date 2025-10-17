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
    const t = setTimeout(() => inputRef.current?.focus?.(), 150);
    return () => clearTimeout(t);
  }, []);

  // PWA-Install-Hinweis (nur, wenn nicht installiert & noch nicht gesehen)
  useEffect(() => {
    const installed = window.matchMedia("(display-mode: standalone)").matches;
    if (installed) return;

    if (localStorage.getItem("PWA_HINT_SEEN")) return;

    const onBIP = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallHint(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);

    // iOS Safari hat kein beforeinstallprompt -> trotzdem dezenten Hinweis
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
      const t = setTimeout(() => setShowInstallHint(true), 1500);
      return () => {
        clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", onBIP);
      };
    }
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } else {
      alert("📲 iOS: Teilen ▸ Zum Home-Bildschirm hinzufügen");
    }
    setShowInstallHint(false);
    localStorage.setItem("PWA_HINT_SEEN", "1");
  };

  const canStart = playerName.trim().length > 0;
  const onKeyDown = (e) => {
    if (e.key === "Enter" && canStart) onStart();
  };

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <span style={{ fontWeight: 900, letterSpacing: 1 }}>WW</span>
        </div>

        <h1 style={styles.title}>Werkstatt-Wahnsinn</h1>
        <p style={styles.subtitle}>Mini-Games · Reaktion · Quiz · schwarzer Humor</p>

        {/* Name */}
        <div style={styles.fieldWrap}>
          <label htmlFor="playerName" style={styles.label}>Dein Name</label>
          <input
            id="playerName"
            ref={inputRef}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="z. B. Alex"
            autoComplete="name"
            style={styles.input}
          />
        </div>

        {/* Buttons */}
        <div style={styles.actions}>
          <button
            className="btn"
            onClick={onStart}
            disabled={!canStart}
            style={{ ...styles.btnPrimary, ...(canStart ? {} : styles.btnDisabled) }}
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

        {/* Info */}
        <div style={styles.info}>
          <div>
            <span style={styles.infoLabel}>Highscore lokal:</span> <b>{highscore ?? 0}</b>
          </div>
          <div style={styles.dot} />
          <div>🕒 Rundenlänge: <b>20 s</b> (fix)</div>
        </div>
      </div>

      {/* Install-Hint */}
      {showInstallHint && (
        <div style={styles.install}>
          <span style={{ fontWeight: 700 }}>📱 Zum Home-Bildschirm hinzufügen</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.installBtn} onClick={handleInstall}>Jetzt hinzufügen</button>
            <button
              style={styles.installClose}
              onClick={() => {
                setShowInstallHint(false);
                localStorage.setItem("PWA_HINT_SEEN", "1");
              }}
              aria-label="Hinweis schließen"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== Styles ========== */
const styles = {
  screen: {
    minHeight: "100svh",
    padding:
      "calc(16px + env(safe-area-inset-top)) 16px calc(16px + env(safe-area-inset-bottom)) 16px",
    display: "grid",
    gridTemplateRows: "1fr",
    alignItems: "center",
    justifyItems: "center",
    background:
      "radial-gradient(1200px 600px at 50% -10%, rgba(37,99,235,.12), transparent 60%)",
  },
  card: {
    width: "min(560px, calc(100vw - 32px))",
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 20,
    padding: 20,
    display: "grid",
    justifyItems: "center",
    gap: 14,
    color: "#e5e7eb",
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(150deg,#34d399 0%,#22d3ee 55%,#3b82f6 100%)",
    color: "#0b1220",
    fontSize: 22,
    border: "2px solid #1f2937",
  },
  title: { margin: 0, marginTop: 6, fontSize: 32, textAlign: "center", fontWeight: 900 },
  subtitle: { margin: 0, color: "#cbd5e1", textAlign: "center" },
  fieldWrap: { width: "100%", maxWidth: 460 },
  label: { display: "block", fontSize: 13, color: "#9ca3af", marginBottom: 6 },
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
  actions: { width: "100%", maxWidth: 460, display: "grid", gap: 10 },
  btnPrimary: {
    width: "100%",
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
    width: "100%",
    background: "#334155",
    borderRadius: 12,
    border: "none",
    color: "#e5e7eb",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 800,
  },
  btnGhost: {
    width: "100%",
    background: "#0b1220",
    borderRadius: 12,
    border: "2px solid #1f2937",
    color: "#e5e7eb",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 800,
  },
  btnDisabled: { opacity: 0.55, cursor: "not-allowed", filter: "grayscale(25%)" },
  info: {
    width: "100%",
    maxWidth: 460,
    marginTop: 4,
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
  install: {
    position: "fixed",
    left: "50%",
    bottom: "calc(env(safe-area-inset-bottom) + 14px)",
    transform: "translateX(-50%)",
    maxWidth: "calc(100vw - 24px)",
    width: "fit-content",
    background: "rgba(17,24,39,.96)",
    border: "2px solid #1f2937",
    borderRadius: 16,
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#e5e7eb",
    zIndex: 100,
  },
  installBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "8px 10px",
    fontWeight: 700,
    cursor: "pointer",
  },
  installClose: {
    background: "transparent",
    border: "none",
    color: "#9ca3af",
    fontSize: 18,
    cursor: "pointer",
    padding: 4,
  },
};