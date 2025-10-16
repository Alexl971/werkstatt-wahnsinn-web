import React, { useEffect, useRef, useState } from "react";
import TapFrenzy from "../games/TapFrenzy";

/**
 * props:
 * - game: string ('TAP_FRENZY' ...), aktuell 1. Spiel, weitere folgen
 * - roundSeconds: number
 * - onRoundEnd(earned: number): void
 */
export default function GameRouter({ game, roundSeconds, onRoundEnd }) {
  const [earned, setEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(roundSeconds);
  const timerRef = useRef();

  useEffect(() => {
    // neue Runde → reset
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
    if (timeLeft === 0) {
      onRoundEnd(earned);
    }
  }, [timeLeft, earned, onRoundEnd]);

  const add = (n) => setEarned((e) => e + n);

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <div>⏱️ {timeLeft}s</div>
        <div>Punkte: {earned}</div>
        <button style={styles.btnSecondary} onClick={() => onRoundEnd(earned)}>
          Runde beenden
        </button>
      </div>

      {game === "TAP_FRENZY" && <TapFrenzy onScore={add} />}

      {/* Hier fügen wir gleich die weiteren Spiele ein:
          QUIZ, SWIPE_APPROVAL, SORT_SEQUENCE, BRAKE_TEST, CODE_TYPER */}
    </div>
  );
}

const styles = {
  wrap: {
    width: "100%",
    maxWidth: 560,
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 16,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
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
};