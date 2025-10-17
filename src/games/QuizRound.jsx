import React, { useEffect, useMemo, useRef, useState } from "react";

/** ---------------------------
 *  Fragen (deine Liste)
 *  --------------------------*/
const QUESTIONS = [
  { q: "Was zeigt der AdBlue-Tank im Ducato meistens an?",
    a: ["Immer 100 %", "Nur die Wahrheit", "Nichts, weil Sensor defekt", "Zufallswert je nach Tagesform"], correct: 0 },
  { q: "Was ist die wahrscheinlichste Ursache, wenn ein Ducato nach Frontscheiben-Tausch wieder nass ist?",
    a: ["Wetter", "Silikon vergessen", "Zu wenig Kleber!", "Alle drei"], correct: 2 },
  { q: "Wofür steht das Kürzel „AW“?",
    a: ["Arbeit wertvoll", "Arbeitswerte", "Ach, wieder was Neues", "Autohaus-Weisheit"], correct: 1 },
  { q: "Wie viele Updates braucht ein Fiat-Getriebe, bis es vielleicht sauber schaltet?",
    a: ["Eins", "Zwei", "Fünf", "Keins"], correct: 0 },
  { q: "Was bedeutet es, wenn das Auto aus der Aufbereitung kommt?",
    a: ["Neu wie aus dem Werk", "Gleich dreckig wie vorher", "Jetzt mit neuem Kratzer", "Antwort B + C"], correct: 3 },
  { q: "Wie erkennt man, dass Jes wieder im Gebäude ist?",
    a: ["Die Dad-Jokes schallen durch die Räume", "Das WLAN wird langsamer", "Der Drucker streikt", "Man hört irgendwo ein „Na, läuft?“"], correct: 0 },
  { q: "Wer ist schuld, wenn etwas schiefläuft?",
    a: ["Oleh", "Yannic", "Ibo", "Jes"], correct: 2 },
  { q: "Was ist die schnellste Art, ein Auto zu waschen?",
    a: ["Regen", "Azubi", "Handwäsche", "Keine – es kommt eh dreckig zurück"], correct: 0 },
  { q: "Wie nennt man den natürlichen Feind der Garantieabteilung?",
    a: ["Der Kunde", "Die Herstellerrichtlinie", "Der falsche Kilometerstand", "Das Faxgerät"], correct: 2 },
  { q: "Wenn jemand sagt „Mach ich gleich“, was bedeutet das realistisch?",
    a: ["Heute noch", "Morgen vielleicht", "Nach’m Kaffee", "Nie, aber mit Stil"], correct: 1 },
  { q: "Was bedeutet es, wenn ein Kunde sagt: „Ich hab schon alles geprüft“?",
    a: ["Motorhaube geöffnet und wieder zugemacht", "Sicherungen angeschaut – von oben", "In einem Forum gelesen", "Alles außer das Richtige"], correct: 2 },
  { q: "Was macht der Verkäufer, wenn ein Kunde nach der Lieferzeit fragt?",
    a: ["Im Computer nachsehen", "Eine Schätzung abgeben", "Kaffee holen", "So tun, als hätte er gerade eine E-Mail bekommen"], correct: 1 },
  { q: "Was ist das häufigste Werkzeug im Servicebüro?",
    a: ["Tacker", "Telefon", "Kugelschreiber", "Kaffeeautomat"], correct: 2 },
  { q: "Was bedeutet es, wenn der Werkstattmeister „gleich“ sagt?",
    a: ["Jetzt sofort", "Nach der Mittagspause", "Nach drei anderen Autos", "Irgendwann heute – vielleicht"], correct: 3 },
  { q: "Was passiert, wenn ein Azubi sagt: „Ich hab’s festgezogen“?",
    a: ["Drehmoment passt", "Schraube rund", "Thomas greift lieber nochmal nach", "Schon abgerissen"], correct: 3 },
];

/** Utility: Shuffle Fragen bei Mount */
function useShuffled(list) {
  return useMemo(() => {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [list]);
}

/** WebAudio: kleine Sounds ohne Dateien */
function useQuizSounds() {
  const ctxRef = useRef(null);
  const ensure = () => (ctxRef.current ??= new (window.AudioContext || window.webkitAudioContext)());

  const tone = (freq = 440, dur = 0.15, type = "sine", vol = 0.2) => {
    const ctx = ensure();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  };

  const correct = () => {
    tone(660, 0.09, "sine", 0.18);
    setTimeout(() => tone(880, 0.12, "sine", 0.18), 90);
  };
  const wrong = () => {
    tone(220, 0.18, "square", 0.22);
    setTimeout(() => tone(180, 0.18, "square", 0.18), 120);
  };

  return { correct, wrong };
}

export default function QuizRound({ onScore }) {
  const questions = useShuffled(QUESTIONS);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [shake, setShake] = useState(false);
  const [localScore, setLocalScore] = useState(0);
  const animKey = `${idx}-${questions[idx]?.q}`;

  const q = questions[idx];
  const { correct, wrong } = useQuizSounds();

  const handleAnswer = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const ok = i === q.correct;

    if (ok) {
      correct();
      onScore(10);
      setLocalScore((s) => s + 10);
    } else {
      wrong();
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }

    // kurze Pause, dann nächste Frage
    setTimeout(() => {
      setAnswered(false);
      setSelected(null);
      setIdx((x) => (x + 1) % questions.length);
    }, ok ? 900 : 1200);
  };

  // Keyframe-CSS einmalig injizieren
  useEffect(() => {
    if (document.getElementById("quiz-anim-styles")) return;
    const style = document.createElement("style");
    style.id = "quiz-anim-styles";
    style.innerHTML = `
      @keyframes fadeUp { from {opacity:0; transform: translateY(8px);} to {opacity:1; transform: translateY(0);} }
      @keyframes pulse { 0%{transform:scale(1)} 50%{transform:scale(1.02)} 100%{transform:scale(1)} }
      @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
      .quiz-fade { animation: fadeUp .28s ease both; }
      .quiz-pulse { animation: pulse .6s ease; }
      .quiz-shake { animation: shake .45s ease; }
      .quiz-hover:hover { transform: translateY(-1px); }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={styles.container} key={animKey} className="quiz-fade">
      {/* Fortschritt */}
      <div style={styles.progressRow}>
        <div>Frage {idx + 1} / {questions.length}</div>
        <div style={{ opacity: .8 }}>Runden-Punkte: {localScore}</div>
      </div>

      <h2 style={styles.question}>{q.q}</h2>

      <div style={styles.answers} className={shake ? "quiz-shake" : ""}>
        {q.a.map((text, i) => {
          const isSel = i === selected;
          const isCorrect = answered && i === q.correct;
          const bg = isSel ? "#1d4ed8" : isCorrect ? "#15803d" : "#1e293b";
          const border = isCorrect ? "#22c55e" : isSel ? "#1e40af" : "#334155";

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={answered}
              className="quiz-hover"
              style={{
                ...styles.answer,
                background: bg,
                borderColor: border,
                opacity: answered && !isSel && !isCorrect ? 0.7 : 1,
                boxShadow: isSel ? "0 8px 24px rgba(29,78,216,.35)" :
                           isCorrect ? "0 8px 24px rgba(21,128,61,.35)" : "none",
              }}
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** ---------------------------
 *  Styles
 *  --------------------------*/
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
    textAlign: "center",
    padding: 8,
  },
  progressRow: {
    width: "100%",
    maxWidth: 520,
    display: "flex",
    justifyContent: "space-between",
    color: "#cbd5e1",
    fontSize: 14,
  },
  question: {
    fontSize: 20,
    fontWeight: 700,
    color: "#f1f5f9",
    margin: "6px 0 4px",
  },
  answers: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 10,
    width: "100%",
    maxWidth: 520,
  },
  answer: {
    padding: "12px 16px",
    borderRadius: 12,
    border: "2px solid #334155",
    background: "#1e293b",
    color: "#e2e8f0",
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform .12s ease, opacity .12s ease, box-shadow .2s ease",
    textAlign: "left",
  },
};