import React, { useEffect, useRef, useState } from "react";

export default function CodeTyper({ onScore }) {
  const codes = ["P1DB7-00", "U0121", "P0420", "B10AA", "C0035"];
  const [target, setTarget] = useState(
    codes[Math.floor(Math.random() * codes.length)]
  );
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState("");
  const ref = useRef(null);

  // Fokus direkt auf Input-Feld setzen
  useEffect(() => {
    ref.current?.focus();
  }, [target]);

  const check = () => {
    if (input.trim().toUpperCase() === target) {
      onScore(12);
      setMsg("✅ Richtig! +12 Punkte");
    } else {
      setMsg("❌ Falsch!");
    }
    setInput("");
    // neuer Code
    const next = codes[Math.floor(Math.random() * codes.length)];
    setTarget(next);
    ref.current?.focus();
  };

  return (
    <div style={styles.center}>
      <div style={styles.title}>Fehlercode-Tapper</div>
      <div style={{ marginBottom: 10 }}>
        Tippe exakt: <b>{target}</b>
      </div>

      <input
        ref={ref}
        value={input}
        onChange={(e) => setInput(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === "Enter" && check()}
        style={styles.input}
        placeholder="Code eingeben..."
        autoFocus
      />

      <button style={styles.btn} onClick={check}>Prüfen</button>

      <div style={{ marginTop: 8, color: "#cbd5e1" }}>{msg}</div>
    </div>
  );
}

const styles = {
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    textAlign: "center",
    minHeight: 260,
  },
  title: { fontSize: 26, fontWeight: 800 },
  input: {
    background: "#0b1220",
    color: "#e5e7eb",
    border: "2px solid #1f2937",
    borderRadius: 10,
    padding: "10px 12px",
    width: "100%",
    maxWidth: 220,
    outline: "none",
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 1,
  },
  btn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: 700,
    marginTop: 6,
  },
};