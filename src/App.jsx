import React, { useMemo, useState } from "react";
import Menu from "./components/Menu";
import Settings from "./components/Settings";
import Highscores from "./components/Highscores";
import useLocalStorage from "./hooks/useLocalStorage";
import GameRouter from "./components/GameRouter";

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
  // fest auf 20s (fix)
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
  const [score, setScore] = useState(0);          // Gesamtscore (lokal) über viele Runden
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
      {/* MENU: kein zusätzlicher Wrapper mehr – Menu zentriert sich selbst */}
      {screen === "MENU" && (
        <Menu
          onStart={startRound}
          onSettings={() => setScreen("SETTINGS")}
          onHighscores={() => setScreen("HIGHSCORES")}
          playerName={playerName}
          setPlayerName={setPlayerName}
          highscore={highscore}
        />
      )}

      {screen === "SETTINGS" && (
        <Settings
          settings={settings}
          setSettings={setSettings}
          onBack={() => setScreen("MENU")}
          onQuickStart={startRound}
        />
      )}

      {screen === "HIGHSCORES" && (
        <div className="card" style={{ ...styles.centerCard, maxWidth: 920 }}>
          <Highscores onBack={() => setScreen("MENU")} />
        </div>
      )}

      {screen === "GAME" && currentGame && (
        <GameRouter
          game={currentGame}
          roundSeconds={20}                 // fix
          onRoundEnd={onRoundEnd}
          playerName={playerName}           // wichtig: Online-Score speichern
        />
      )}

      {screen === "RESULT" && (
        <div className="card" style={styles.centerCard}>
          <h2 style={{ margin: 0 }}>Rundenende</h2>
          <div style={{ marginTop: 6 }}>Runde: {roundScore} Punkte</div>
          <div>Gesamt: {score} Punkte</div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", justifyContent: "center" }}>
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
    minHeight: "100svh",
    background: "#0f172a",
    color: "#e5e7eb",
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
    padding:
      "calc(16px + env(safe-area-inset-top)) 16px calc(16px + env(safe-area-inset-bottom)) 16px",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    backgroundImage:
      "radial-gradient(1200px 600px at 50% -10%, rgba(37,99,235,.10), transparent 60%)",
  },
  centerCard: {
    width: "min(560px, calc(100vw - 32px))",
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 20,
    display: "grid",
    gap: 10,
    justifyItems: "center",
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