import React, { useEffect, useRef, useState } from "react";
import TapFrenzy from "../games/TapFrenzy";
import QuizRound from "../games/QuizRound";
import SwipeApproval from "../games/SwipeApproval";
import SortSequence from "../games/SortSequence";
import BrakeTest from "../games/BrakeTest";
import CodeTyper from "../games/CodeTyper";
import { addBestGameScore } from "../lib/supabase-best";

/**
 * props:
 * - game: string ('TAP_FRENZY' ...)
 * - roundSeconds: number
 * - onRoundEnd(earned: number): void
 * - playerName: string
 */
export default function GameRouter({ game, roundSeconds, onRoundEnd, playerName }) {
  const [earned, setEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(roundSeconds);
  const [confirmingEnd, setConfirmingEnd] = useState(false);
  const confirmTimerRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setEarned(0);
    setTimeLeft(roundSeconds);
    setConfirmingEnd(false);
    clearTimeout(confirmTimerRef.current);
  }, [game, roundSeconds]);

  // Countdown
  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [game, roundSeconds]);

  // Rundenende
  useEffect(() => {
    if (timeLeft === 0) endRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const add = (n) => setEarned((e) => e + n);

  const endRound = async () => {
    // Online-Highscore pro Spiel aktualisieren
    if (playerName && game && Number.isFinite(earned)) {
      try {
        await addBestGameScore(playerName, game, earned);
      } catch {
        // ignoriere Netzwerkfehler still
      }
    }
    onRoundEnd(earned);
  };

  const requestEnd = () => {
    if (confirmingEnd) return endRound();
    setConfirmingEnd(true);
    clearTimeout(confirmTimerRef.current);
    confirmTimerRef.current = setTimeout(() => setConfirmingEnd(false), 2000);
  };

  return (
    <div style={styles.shell}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.badge}>⏱️ {timeLeft}s</span>
        <span style={styles.badge}>Punkte: {earned}</span>
        <button style={styles.btnSecondary} onClick={requestEnd}>
          Runde beenden
        </button>
      </div>

      {/* schlanke Confirm-Zeile (kein Overlay) */}
      {confirmingEnd && (
        <div style={styles.confirmRow}>
          <span>Beenden wirklich? Tippe erneut innerhalb von 2 Sekunden.</span>
          <button onClick={endRound} style={styles.confirmBtn}>Jetzt beenden</button>
        </div>
      )}

      {/* Body */}
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
    width: "min(720px, calc(100vw - 32px))",
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 16,
    margin: "0 auto",
    display: "grid",
    gap: 10,
  },
  header: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr auto",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 12,
    background: "#0b1220",
    border: "2px solid #1f2937",
    justifySelf: "start",
  },
  btnSecondary: {
    background: "#334155",
    borderRadius: 12,
    border: "none",
    color: "#e5e7eb",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
    justifySelf: "end",
  },
  confirmRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 12,
    background: "#3f1d1d",
    border: "2px solid #7f1d1d",
    color: "#fecaca",
  },
  confirmBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "8px 10px",
    fontWeight: 800,
    cursor: "pointer",
  },
  cardBody: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    paddingTop: 24,
    paddingBottom: 8,
    minHeight: 280,
    textAlign: "center",
  },
};