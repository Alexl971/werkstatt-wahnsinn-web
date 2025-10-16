import React, { useState } from "react";

const QUESTIONS = [
  {
    question: "Wer hat letzte Woche den Schlüssel verlegt?",
    answers: ["Thomas", "Susanne", "Yannic", "Der Kunde"],
    correct: 0,
  },
  {
    question: "Wie viele AW hat 33,5 AW bei AW-Teiler 10?",
    answers: ["3,35 Std", "33,5 Std", "0,335 Std", "10 Std"],
    correct: 0,
  },
  {
    question: "Was verschüttet sich schneller?",
    answers: [
      "Kaffee im Pausenraum",
      "Getriebeöl beim Ölwechsel 3000",
      "Beides gleich schnell",
      "Kommt auf den Azubi an",
    ],
    correct: 3,
  },
];

export default function QuizRound({ onScore }) {
  const [q] = useState(
    QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]
  );
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);

  const handleSelect = (i) => {
    if (locked) return;
    setSelected(i);
    setLocked(true);
    if (i === q.correct) onScore(10);
  };

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Quiz</h2>
      <p style={styles.question}>{q.question}</p>

      {q.answers.map((a, i) => (
        <button
          key={i}
          onClick={() => handleSelect(i)}
          style={{
            ...styles.answer,
            backgroundColor:
              locked && i === q.correct
                ? "#22c55e"
                : locked && i === selected
                ? "#ef4444"
                : "#1e293b",
          }}
        >
          {a}
        </button>
      ))}
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 260,
    color: "#e5e7eb",
  },
  title: { fontSize: 26, fontWeight: 800, marginBottom: 6 },
  question: { opacity: 0.9, textAlign: "center" },
  answer: {
    border: "none",
    borderRadius: 12,
    padding: "10px 20px",
    width: "100%",
    maxWidth: 320,
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },
};