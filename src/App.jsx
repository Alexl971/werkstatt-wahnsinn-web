// src/App.jsx
import React, { useMemo, useState } from "react";
import Menu from "./components/Menu";
import Settings from "./components/Settings";
import Highscores from "./components/Highscores";
import useLocalStorage from "./hooks/useLocalStorage";
import GameRouter from "./components/GameRouter";

/**
 * Einstellungen (ohne Rundenlänge – ist fix 20s)
 */
const DEFAULT_SETTINGS = {
  enabledGames: {
    TAP_FRENZY: true,
    QUIZ: true,
    SWIPE_APPROVAL: true,
    SORT_SEQUENCE: true,
    BRAKE_TEST: true,
    CODE_TYPER: true,
  },
  soundEnabled: true,
};

export default function App() {
  // Screens: MENU | SETTINGS | GAME | RESULT | HIGHSCORES
  const [screen, setScreen] = useState("MENU");

  // Persistente Werte
  const [playerName, setPlayerName] = useLocalStorage("PLAYER_NAME", "");
  const [highscore, setHighscore] = useLocalStorage("HIGH_SCORE", 0);
  const [settings, setSettings] = useLocalStorage("SETTINGS", DEFAULT_SETTINGS);

  // Runden-/Spiel-State
  const [score, setScore] = useState(0);           // Gesamtscore (lokal)
  const [roundScore, setRoundScore] = useState(0); // Score der letzten Runde
  const [currentGame, setCurrentGame] = useState(null);

  // Liste aktivierter Spiele
  const enabledGames = useMemo(
    () =>
      Object.entries(settings.enabledGames)
        .filter(([, v]) => v)
        .map(([k]) => k),
    [settings.enabledGames]
  );

  // Runde starten -> zufälliges aktives Spiel
  const startRound = () => {
    if (!playerName.trim()) {
      alert("Bitte gib einen Spielernamen ein.");
      return;
    }
    if (enabledGames.length === 0) {
      alert("Keine Spiele aktiv. Bitte in den Einstellungen Spiele aktivieren.");
      setScreen("SETTINGS");
      return;
    }
    const next = enabledGames[Math.floor(Math.random() * enabledGames.length)];
    setCurrentGame(next);
    setRoundScore(0);
    setScreen("GAME");
  };

  // Callback vom GameRouter, wenn Runde endet
  const onRoundEnd = (earned) => {
    setRoundScore(earned);
    const total = score + earned;
    setScore(total);
    if (total > highscore) setHighscore(total);
    setScreen("RESULT");
  };

  return (
    <div style={styles.app}>
      {/* Menü */}
      {screen === "MENU" && (
        <div className="card" style={styles.card}>
          <Menu
            onStart={startRound}
            onSettings={() => setScreen("SETTINGS")}
            onHighscores={() => setScreen("HIGHSCORES")}
            playerName={playerName}
            setPlayerName={setPlayerName}
            highscore={highscore}
          />
        </div>
      )}

      {/* Einstellungen (mit Untermenü & Start oben rechts) */}
      {screen === "SETTINGS" && (
        <Settings
          settings={settings}
          setSettings={setSettings}
          onBack={() => setScreen("MENU")}
          onQuickStart={startRound}
        />
      )}

      {/* Highscores (pro Spiel, bester Score je Spieler, Zeitfilter clientseitig) */}
      {screen === "HIGHSCORES" && (
        <div className="card" style={{ ...styles.centerCard, maxWidth: 980 }}>
          <Highscores onBack={() => setScreen("MENU")} currentPlayer={playerName} />
        </div>
      )}

      {/* Spiel-Router (20s fix) */}
      {screen === "GAME" && currentGame && (
        <GameRouter
          game={currentGame}
          roundSeconds={20}       // <-- fix auf 20 Sekunden
          onRoundEnd={onRoundEnd}
          playerName={playerName} // für Online-Score (supabase)
        />
      )}

      {/* Ergebnis-Screen: Buttons unten in Grid */}
      {screen === "RESULT" && (
        <div className="card" style={styles.resultCard}>
          <div style={styles.resultTop}>
            <h2 style={{ margin: 0, fontSize: 28 }}>Rundenende</h2>
            <div style={{ marginTop: 10, fontSize: 18 }}>
              Runde: <b>{roundScore}</b> Punkte
            </div>
            <div style={{ marginTop: 4, fontSize: 18 }}>
              Gesamt: <b>{score}</b> Punkte
            </div>
          </div>

          <div style={styles.resultFooter}>
            <button
              className="btn"
              style={{ ...styles.btnPrimary, flex: 1 }}
              onClick={startRound}
            >
              Nächste Runde
            </button>
            <button
              className="btn"
              style={{ ...styles.btnSecondary, flex: 1 }}
              onClick={() => setScreen("MENU")}
            >
              Menü
            </button>
            <button
              className="btn"
              style={{ ...styles.btnGhost, flex: 1 }}
              onClick={() => setScreen("HIGHSCORES")}
            >
              🏆 Highscores
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= Styles ================= */
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
    maxWidth: 720,
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 0,
  },
  centerCard: {
    width: "100%",
    maxWidth: 560,
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 10,
  },
  /* Ergebnis-Layout: Buttons unten, Safe-Area */
  resultCard: {
    width: "100%",
    maxWidth: 560,
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 360,
    gap: 12,
    paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
  },
  resultTop: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 4,
    marginTop: 8,
  },
  resultFooter: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
  },
  btnPrimary: {
    background: "#2563eb",
    borderRadius: 12,
    border: "none",
    color: "white",
    padding: "14px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
  btnSecondary: {
    background: "#334155",
    borderRadius: 12,
    border: "none",
    color: "#e5e7eb",
    padding: "14px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
  btnGhost: {
    background: "#0b1220",
    borderRadius: 12,
    border: "2px solid #1f2937",
    color: "#e5e7eb",
    padding: "14px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
};