import React, { useEffect, useRef, useState } from "react";
import TapFrenzy from "../games/TapFrenzy";
import QuizRound from "../games/QuizRound";
import SwipeApproval from "../games/SwipeApproval";
import SortSequence from "../games/SortSequence";
import BrakeTest from "../games/BrakeTest";
import CodeTyper from "../games/CodeTyper";

/**
 * props:
 * - game: string ('TAP_FRENZY' ...)
 * - roundSeconds: number
 * - onRoundEnd(earned: number): void
 */
export default function GameRouter({ game, roundSeconds, onRoundEnd }) {
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
    if (timeLeft === 0) onRoundEnd(earned);
  }, [timeLeft, earned, onRoundEnd]);

  const add = (n) => setEarned((e) => e + n);

  return (
    <div style={styles.shell}>
      <div style={styles.header}>
        <span style={styles.badge}>⏱️ {timeLeft}s</span>
        <span style={styles.badge}>Punkte: {earned}</span>
        <button style={styles.btnSecondary} onClick={() => onRoundEnd(earned)}>
          Runde beenden
        </button>
      </div>

      <div style={styles.cardBody}>
        {game === "TAP_FRENZY" && <TapFrenzy onScore={add} />}
        {game === "QUIZ" && <QuizRound onScore={add} />}
        {game === "SWIPE_APPROVAL" && <SwipeApproval onScore={add} />}
        {game === "SORT_SEQUENCE" && <SortSequence onScore={add} />}
        {game === "BRAKE_TEST" && <BrakeTest onScore={add} />}
        {game === "CODE_TYPER" && <CodeTyper onScore={add} />}
        {/* weitere Spiele kommen hier gleich */}
      </div>
    </div>
  );
}

const styles = {
  shell: {
    width: "100%",
    maxWidth: 560,
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 16,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,                // <— Abstand zwischen Timer / Punkte
    justifyContent: "space-between",
    flexWrap: "wrap",       // <— bricht um, wenn’s eng wird
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    paddingTop: 16,         // <— Abstand unter der Kopfzeile
    minHeight: 260,         // <— genug Platz fürs Spiel
    textAlign: "center",
  },
};