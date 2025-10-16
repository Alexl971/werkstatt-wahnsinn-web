import React, { useMemo, useState } from "react";
import Menu from "./components/Menu";
import Settings from "./components/Settings";
import Highscores from "./components/Highscores";
import useLocalStorage from "./hooks/useLocalStorage";
import GameRouter from "./components/GameRouter";
import { addScore } from "./lib/supabase";

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
  // MENU | SETTINGS | GAME | RESULT | HIGHSCORES
  const [screen, setScreen] = useState("MENU");

  const [playerName, setPlayerName] = useLocalStorage("PLAYER_NAME", "");
  const [highscore, setHighscore] = useLocalStorage("HIGH_SCORE", 0);
  const [settings, setSettings] = useLocalStorage("SETTINGS", DEFAULT_SETTINGS);

  const [score, setScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [currentGame, setCurrentGame] = useState(null);
  const [uploaded, setUploaded] = useState(false); // verhindert Doppel-Upload

  const enabledGames = useMemo(
    () =>
      Object.entries(settings.enabledGames)
        .filter(([, v]) => v)
        .map(([k]) => k),
    [settings.enabledGames]
  );

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
    setUploaded(false);
    setScreen("GAME");
  };

  const onRoundEnd = async (earned) => {
    setRoundScore(earned);
    const total = score + earned;
    setScore(total);
    if (total > highscore) setHighscore(total);
    setScreen("RESULT");

    // Score automatisch in die Online-Liste hochladen (falls möglich)
    if (!uploaded && playerName.trim()) {
      setUploaded(true);
      try {
        await addScore({ name: playerName.trim().slice(0, 24), points: total });
      } catch {
        // Ignorieren; Button für Highscores bleibt ja im Menü
      }
    }
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
        <Highscores onBack={() => setScreen("MENU")} />
      )}

      {screen === "GAME" && currentGame && (
        <GameRouter
          game={currentGame}
          roundSeconds={settings.roundSeconds}
          onRoundEnd={onRoundEnd}
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
              🏆 Online-Highscores
            </button>
          </div>
          <div style={{ color: "#cbd5e1", marginTop: 6, fontSize: 13 }}>
            {uploaded ? "Score wurde (sofern konfiguriert) hochgeladen." : "Wird automatisch hochgeladen."}
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