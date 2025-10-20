// src/components/GameRouter.jsx
import React, { useEffect, useRef, useState } from "react";
import TapFrenzy from "../games/TapFrenzy";
import QuizRound from "../games/QuizRound";
import SwipeApproval from "../games/SwipeApproval";
import SortSequence from "../games/SortSequence";
import BrakeTest from "../games/BrakeTest";
import CodeTyper from "../games/CodeTyper";
import { addBestGameScore } from "../lib/supabase";

/** props:
 * - game: 'TAP_FRENZY' | 'QUIZ' | ...
 * - roundSeconds: number (hier: 20s)
 * - onRoundEnd(earned:number)
 * - user: { id, username }
 */
export default function GameRouter({ game, roundSeconds, onRoundEnd, user }) {
  const [earned, setEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(roundSeconds);
  const timerRef = useRef();

  useEffect(() => {
    setEarned(0);
    setTimeLeft(roundSeconds);
  }, [game, roundSeconds]);

  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [game, roundSeconds]);

  useEffect(() => {
    if (timeLeft === 0) finish();
    // eslint-disable-next-line
  }, [timeLeft]);

  const add = (n) => setEarned((e) => e + n);

  const finish = async () => {
    // Online Highscore best-per-player speichern
    try {
      await addBestGameScore({
        player_name: user?.username || "Anonymous",
        user_id: user?.id || null,
        game_name: game,
        score: earned,
      });
    } catch {}
    onRoundEnd(earned);
  };

  return (
    <div style={styles.shell}>
      <div style={styles.header}>
        <span style={styles.badge}>⏱️ {timeLeft}s</span>
        <span style={styles.badge}>Punkte: {earned}</span>
        <button style={styles.btnSecondary} onClick={finish}>Runde beenden</button>
      </div>

      <div style={styles.cardBody}>
        {game === "TAP_FRENZY" && <TapFrenzy onScore={add} />}
        {game === "QUIZ" && <QuizRound onScore={add} />}
        {game === "SWIPE_APPROVAL" && <SwipeApproval onScore={add} />}
        {game === "SORT_SEQUENCE" && <SortSequence onScore={add} />}
        {game === "BRAKE_TEST" && <BrakeTest onScore={add} />}
        {game === "CODE_TYPER" && <CodeTyper onScore={add} />}
      </div>

      {/* fixer Footer, damit man nicht aus Versehen Menüs trifft */}
      <div style={styles.footer}>
        <button style={styles.btnSecondary} onClick={finish}>Runde beenden</button>
      </div>
    </div>
  );
}

const styles = {
  shell: {
    width: "100%",
    maxWidth: 720,
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 16,
    margin: "0 auto",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    gap: 12,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  badge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 12,
    background: "#0b1220",
    border: "2px solid #1f2937",
  },
  btnSecondary: {
    background: "#334155",
    borderRadius: 12,
    border: "none",
    color: "#e5e7eb",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  cardBody: {
    display: "grid",
    placeItems: "center",
    paddingTop: 12,
    minHeight: 280,
    textAlign: "center",
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 6,
    borderTop: "2px solid #1f2937",
  },
};