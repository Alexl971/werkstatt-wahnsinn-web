// src/games/QuizRound.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const LOCAL = [
  { question: "Wofür steht „AW“?", answers: ["Arbeit wertvoll","Arbeitswerte","Ach, wieder was Neues","Autohaus-Weisheit"], correct_index: 1 },
  { question: "AdBlue-Tank im Ducato zeigt meistens…?", answers: ["Immer 100 %","Nur die Wahrheit","Nichts (Sensor defekt)","Zufallswert"], correct_index: 0 },
];

async function getRandomVisibleQuestion() {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("id, question, answers, correct_index")
    .eq("visible", true)
    .limit(1000);
  if (error || !data?.length) return LOCAL[Math.floor(Math.random()*LOCAL.length)];
  return data[Math.floor(Math.random()*data.length)];
}

export default function QuizRound({ onScore }) {
  const [q, setQ] = useState(null);
  const [picked, setPicked] = useState(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => { const qq = await getRandomVisibleQuestion(); if (alive) setQ(qq); })();
    return () => (alive = false);
  }, []);

  if (!q) return <div>Lade Quiz …</div>;

  const clickAns = (i) => {
    if (locked) return;
    setPicked(i);
    setLocked(true);
    if (i === q.correct_index) onScore(10);
  };

  return (
    <div style={{ display: "grid", gap: 10, width: "min(560px, 100%)" }}>
      <h2 style={{ margin: 0 }}>Quiz</h2>
      <div style={{ color: "#cbd5e1" }}>{q.question}</div>
      {q.answers.map((a, i) => {
        const right = locked && i === q.correct_index;
        const wrongPick = locked && picked === i && i !== q.correct_index;
        return (
          <button
            key={i}
            onClick={() => clickAns(i)}
            disabled={locked}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "2px solid #334155",
              background: right ? "#14532d" : wrongPick ? "#3f1d1d" : "#0b1220",
              color: "#e5e7eb",
              textAlign: "left",
              cursor: locked ? "default" : "pointer",
            }}
          >
            {a}
          </button>
        );
      })}
    </div>
  );
}