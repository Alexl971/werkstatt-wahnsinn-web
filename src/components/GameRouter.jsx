// src/components/GameRouter.jsx
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
 * - playerName?: string
 */
export default function GameRouter({ game, roundSeconds, onRoundEnd }) {
  const [earned, setEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(roundSeconds);

  // ---- Bestätigtes Beenden (Double-Tap) ----
  const [confirmingEnd, setConfirmingEnd] = useState(false);
  const confirmTimer = useRef(null);

  const armConfirm = () => {
    setConfirmingEnd(true);
    clearTimeout(confirmTimer.current);
    confirmTimer.current = setTimeout(() => setConfirmingEnd(false), 2000);
  };

  const handleEndPress = () => {
    if (!confirmingEnd) {
      armConfirm(); // erster Tipp -> „Nochmal tippen…“
      return;
    }
    clearTimeout(confirmTimer.current);
    setConfirmingEnd(false);
    onRoundEnd(earned); // zweiter Tipp innerhalb 2s -> Runde beenden
  };

  // Reset bei Spielwechsel / Rundenstart
  useEffect(() => {
    setEarned(0);
    setTimeLeft(roundSeconds);
    setConfirmingEnd(false);
    clearTimeout(confirmTimer.current);
    return () => clearTimeout(confirmTimer.current);
  }, [game, roundSeconds]);

  // Timer
  const timerRef = useRef();
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

        <button
          style={{
            ...styles.endBtn,
            ...(confirmingEnd ? styles.endBtnConfirm : {}),
          }}
          onClick={handleEndPress}
        >
          {confirmingEnd ? "Nochmal tippen zum Bestätigen" : "Runde beenden"}
        </button>
      </div>

      {/* kleiner Hinweis bei „scharfem“ End-Button */}
      {confirmingEnd && (
        <div style={styles.confirmHint}>
          Beenden wirklich? Tippe erneut innerhalb von 2 Sekunden.
        </div>
      )}

      <div style={styles.cardBody}>
        {game === "TAP_FRENZY" && <TapFrenzy onScore={add} />}
        {game === "QUIZ" && <QuizRound onScore={add} />}
        {game === "SWIPE_APPROVAL" && <SwipeApproval onScore={add} />}
        {game === "SORT_SEQUENCE" && <SortSequence onScore={add} />}
        {game === "BRAKE_TEST" && <BrakeTest onScore={add} />}
        {game === "CODE_TYPER" && <CodeTyper onScore={add} />}
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
    display: "grid",
    gridTemplateColumns: "auto auto 1fr",
    gap: 12,
    alignItems: "center",
  },
  badge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 12,
    background: "#0b1220",
    border: "2px solid #1f2937",
    whiteSpace: "nowrap",
  },

  endBtn: {
    justifySelf: "end",
    background: "#334155",
    borderRadius: 12,
    border: "none",
    color: "#e5e7eb",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 800,
    transition: "all .15s ease",
    whiteSpace: "nowrap",
  },
  endBtnConfirm: {
    background: "#ef4444",
    color: "#fff",
    boxShadow: "0 0 0 2px #ef444499 inset",
  },

  confirmHint: {
    marginTop: 6,
    fontSize: 12,
    color: "#fca5a5",
    textAlign: "right",
  },

  cardBody: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    paddingTop: 36, // mehr Abstand zum Header
    minHeight: 260,
    textAlign: "center",
  },
};