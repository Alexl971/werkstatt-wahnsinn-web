// src/App.jsx
import React, { useMemo, useState } from "react";
import Menu from "./components/Menu";
import Settings from "./components/Settings";
import Highscores from "./components/Highscores";
import GameRouter from "./components/GameRouter";
import useLocalStorage from "./hooks/useLocalStorage";

import Login from "./components/Login";
import { getAuthUser, signOutLocal } from "./lib/auth";

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
  roundSeconds: 20,      // fix
  soundEnabled: true,
};

export default function App() {
  // Auth
  const [authUser, setAuthUser] = useState(getAuthUser());

  // Screens: MENU | SETTINGS | GAME | RESULT | HIGHSCORES
  const [screen, setScreen] = useState("MENU");

  // Persistente Werte
  const [playerName, setPlayerName] = useLocalStorage("PLAYER_NAME", "");
  const [highscore, setHighscore] = useLocalStorage("HIGH_SCORE", 0);
  const [settings, setSettings] = useLocalStorage("SETTINGS", DEFAULT_SETTINGS);

  // Runden-/Spiel-State
  const [score, setScore] = useState(0);          // Gesamtscore (lokal)
  const [roundScore, setRoundScore] = useState(0);
  const [currentGame, setCurrentGame] = useState(null);

  // Liste aktivierter Spiele
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
    setScreen("GAME");
  };

  const onRoundEnd = (earned) => {
    setRoundScore(earned);
    const total = score + earned;
    setScore(total);
    if (total > highscore) setHighscore(total);
    setScreen("RESULT");
  };

  const logout = () => {
    signOutLocal();
    setAuthUser(null);
    setScreen("MENU");
  };

  // Wenn nicht eingeloggt -> Login anzeigen
  if (!authUser) {
    return <Login onSuccess={(u) => setAuthUser(u)} />;
  }

  return (
    <div style={styles.app}>
      {screen === "MENU" && (
        <div className="card" style={styles.card}>
          {/* kleiner Header mit Login-Info + Logout */}
          <div style={styles.topBar}>
            <div style={{ opacity: .9 }}>
              Eingeloggt als <b>{authUser.username}</b>
            </div>
            <button className="btn" style={styles.btnGhostSm} onClick={logout}>Abmelden</button>
          </div>

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
        <div className="card" style={{ ...styles.centerCard, maxWidth: 920 }}>
          <Highscores onBack={() => setScreen("MENU")} />
        </div>
      )}

      {screen === "GAME" && currentGame && (
        <GameRouter
          game={currentGame}
          roundSeconds={settings.roundSeconds}
          onRoundEnd={onRoundEnd}
          playerName={playerName}
          user={authUser}                 // << wichtig für Online-Score (user_id)
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
    minHeight: "100svh",
    background: "#0f172a",
    color: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    backgroundImage:
      "radial-gradient(1200px 600px at 50% -10%, rgba(37,99,235,.10), transparent 60%)",
  },
  card: {
    width: "100%",
    maxWidth: 720,
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 0,
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    borderBottom: "2px solid #1f2937",
    background: "#0b1220",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
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
  btnGhostSm: {
    background: "transparent",
    borderRadius: 10,
    border: "2px solid #334155",
    color: "#e5e7eb",
    padding: "6px 10px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
  },
};