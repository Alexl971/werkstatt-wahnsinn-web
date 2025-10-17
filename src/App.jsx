import React, { useMemo, useState } from "react";
import Menu from "./components/Menu";
import Settings from "./components/Settings";
import Highscores from "./components/Highscores"; // Tabs pro Spiel, nutzt fetchTopByGame
import useLocalStorage from "./hooks/useLocalStorage";
import GameRouter from "./components/GameRouter"; // speichert Best-Score via addBestGameScore

// Standard-Einstellungen
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
  // Screens: MENU | SETTINGS | GAME | RESULT | HIGHSCORES
  const [screen, setScreen] = useState("MENU");

  // Persistente Werte
  const [playerName, setPlayerName] = useLocalStorage("PLAYER_NAME", "");
  const [highscore, setHighscore] = useLocalStorage("HIGH_SCORE", 0);
  const [settings, setSettings] = useLocalStorage("SETTINGS", DEFAULT_SETTINGS);

  // Runden-/Spiel-State
  const [score, setScore] = useState(0);           // Gesamtscore (lokal) über viele Runden
  const [roundScore, setRoundScore] = useState(0); // Score in letzter Runde
  const [currentGame, setCurrentGame] = useState(null);

  // Liste aktivierter Spiele (Schalter in Settings)
  const enabledGames = useMemo(
    () =>
      Object.entries(settings.enabledGames)
        .filter(([, v]) => v)
        .map(([k]) => k),
    [settings.enabledGames]
  );

  // Runde starten -> zufälliges aktives Spiel wählen
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

  // Wird von GameRouter aufgerufen, wenn die Runde endet
  const onRoundEnd = (earned) => {
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

      {screen === "SETTINGS" && (
        <Settings
          settings={settings}
          setSettings={setSettings}
          onBack={() => setScreen("MENU")}
        />
      )}

      {screen === "HIGHSCORES" && (
        <div className="card" style={{ ...styles.centerCard, maxWidth: 980 }}>
          {/* Highscores zeigt Tabs pro Spiel und markiert optional den aktuellen Spieler */}
          <Highscores onBack={() => setScreen("MENU")} currentPlayer={playerName} />
        </div>
      )}

      {screen === "GAME" && currentGame && (
        <GameRouter
          game={currentGame}
          roundSeconds={settings.roundSeconds}
          onRoundEnd={onRoundEnd}
          playerName={playerName} // wichtig: damit Online-Score gespeichert wird
        />
      )}

      {screen === "RESULT" && (
        <div className="card" style={styles.centerCard}>
          <h2 style={{ margin: 0 }}>Rundenende</h2>
          <div style={{ marginTop: 6 }}>Runde: {roundScore} Punkte</div>
          <div>Gesamt: {score} Punkte</div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <button className="btn" style={styles.btnPrimary} onClick={startRound}>
              Nächste Runde
            </button>
            <button className="btn" style={styles.btnSecondary} onClick={() => setScreen("MENU")}>
              Menü
            </button>
            <button className="btn" style={styles.btnGhost} onClick={() => setScreen("HIGHSCORES")}>
              🏆 Highscores
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
    gap: 10,
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
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
  btnGhost: {
    background: "#0b1220",
    borderRadius: 12,
    border: "2px solid #1f2937",
    color: "#e5e7eb",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
};