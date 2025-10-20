// src/games/QuizRound.jsx
import React, { useEffect, useState } from "react";
import { getRandomVisibleQuestion } from "../lib/supabase-quiz";

const LOCAL_QUESTIONS = [
  {
    question: "Wofür steht „AW“?",
    answers: ["Arbeit wertvoll", "Arbeitswerte", "Ach, wieder was Neues", "Autohaus-Weisheit"],
    correct_index: 1,
  },
  {
    question: "Was zeigt der AdBlue-Tank im Ducato meistens an?",
    answers: ["Immer 100 %", "Nur die Wahrheit", "Nichts (Sensor defekt)", "Zufallswert"],
    correct_index: 0,
  },
];

export default function QuizRound({ onScore }) {
  const [q, setQ] = useState(null);
  const [picked, setPicked] = useState(null);
  const [locked, setLocked] = useState(false);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await getRandomVisibleQuestion();
      if (!mounted) return;
      if (error || !data) {
        const pick = LOCAL_QUESTIONS[Math.floor(Math.random() * LOCAL_QUESTIONS.length)];
        setQ(pick); setState("ok");
      } else {
        setQ(data); setState("ok");
      }
    })();
    return () => (mounted = false);
  }, []);

  const select = (i) => {
    if (!q || locked) return;
    setPicked(i);
    setLocked(true);
    const good = i === q.correct_index;
    if (good) onScore(10);
  };

  if (state === "loading") return <div>Lade Quiz …</div>;
  if (!q) return <div>Keine Frage gefunden.</div>;

  return (
    <div style={styles.center}>
      <h2 style={{ margin: 0 }}>Quiz</h2>
      <div style={{ margin: "8px 0 14px 0", color: "#cbd5e1" }}>{q.question}</div>
      <div style={{ display: "grid", gap: 8, width: "min(560px, 100%)" }}>
        {q.answers.map((a, i) => {
          const isRight = locked && i === q.correct_index;
          const isWrongPicked = locked && picked === i && i !== q.correct_index;
          return (
            <button
              key={i}
              onClick={() => select(i)}
              disabled={locked}
              style={{
                ...styles.answerBtn,
                ...(isRight ? styles.answerRight : {}),
                ...(isWrongPicked ? styles.answerWrong : {}),
              }}
            >
              {a}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  center: { display: "grid", placeItems: "center", gap: 10, textAlign: "center" },
  answerBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "2px solid #334155",
    background: "#0b1220",
    color: "#e5e7eb",
    cursor: "pointer",
    textAlign: "left",
  },
  answerRight: { background: "#14532d", borderColor: "#16a34a" },
  answerWrong: { background: "#3f1d1d", borderColor: "#b91c1c" },
};