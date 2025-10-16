import React, { useState } from "react";
import Menu from "./components/Menu";
import Settings from "./components/Settings";
import useLocalStorage from "./hooks/useLocalStorage";

const DEFAULT_SETTINGS = {
  enabledGames: {
    TAP_FRENZY: true,
    QUIZ: true,
    SWIPE_APPROVAL: true,
    SORT_SEQUENCE: true,
    BRAKE_TEST: true,
    CODE_TYPER: true,
  },
  roundSeconds: 20,
  soundEnabled: true,
};

export default function App() {
  // Screens: MENU | SETTINGS | GAME | RESULT
  const [screen, setScreen] = useState("MENU");
  const [playerName, setPlayerName] = useLocalStorage("PLAYER_NAME", "");
  const [highscore, setHighscore] = useLocalStorage("HIGH_SCORE", 0);
  const [settings, setSettings] = useLocalStorage("SETTINGS", DEFAULT_SETTINGS);

  const [score, setScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);

  const startRound = () => {
    if (!playerName.trim()) {
      alert("Bitte gib einen Spielernamen ein.");
      return;
    }
    setRoundScore(0);
    setScreen("GAME"); // (nächster Schritt: GameRouter einbauen)
  };

  const endRound = () => {
    const earned = Math.floor(Math.random() * 20) + 1; // Platzhalter
    setRoundScore(earned);
    const total = score + earned;
    setScore(total);
    if (total > highscore) setHighscore(total);
    setScreen("RESULT");
  };

  return (
    <div style={styles.app}>
      {screen === "MENU" && (
        <div className="card" style={styles.card}>
          <Menu onStart={startRound} onSettings={() => setScreen("SETTINGS")} />
          <div style={{ marginTop: 16, width: "100%", maxWidth: 460 }}>
            <input
              placeholder="Spielername"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              style={styles.input}
            />
            <div style={{ color: "#9ca3af", marginTop: 8 }}>
              Highscore: {highscore}
            </div>
          </div>
        </div>
      )}

      {screen === "SETTINGS" && (
        <Settings
          settings={settings}
          setSettings={setSettings}
          onBack={() => setScreen("MENU")}
        />
      )}

      {screen === "GAME" && (
        <div className="card" style={styles.centerCard}>
          <h2 style={{ margin: 0 }}>Runde läuft …</h2>
          <p style={{ color: "#cbd5e1" }}>
            (Im nächsten Schritt kommt hier der Game-Router mit Timer & Skip)
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" style={styles.btnSecondary} onClick={() => setScreen("MENU")}>
              Abbrechen
            </button>
            <button className="btn" style={styles.btnPrimary} onClick={endRound}>
              Runde beenden (Test)
            </button>
          </div>
        </div>
      )}

      {screen === "RESULT" && (
        <div className="card" style={styles.centerCard}>
          <h2 style={{ margin: 0 }}>Rundenende</h2>
          <div style={{ marginTop: 6 }}>Runde: {roundScore} Punkte</div>
          <div>Gesamt: {score} Punkte</div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className="btn" style={styles.btnPrimary} onClick={startRound}>
              Nächste Runde
            </button>
            <button className="btn" style={styles.btnSecondary} onClick={() => setScreen("MENU")}>
              Menü
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 560,
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 16,
  },
  centerCard: {
    width: "100%",
    maxWidth: 560,
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 20,
    display: "flex",
    gap: 10,
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  input: {
    width: "100%",
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
    color: "white",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
  btnSecondary: {
    background: "#334155",
    borderRadius: 12,
    border: "none",
    color: "#e5e7eb",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
};