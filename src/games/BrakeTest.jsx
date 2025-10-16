import React, { useEffect, useRef, useState } from "react";

export default function BrakeTest({ onScore }) {
  const [state, setState] = useState("idle"); // idle | wait | stop
  const [msg, setMsg] = useState("Warte auf das Signal …");
  const timerRef = useRef();

  const schedule = () => {
    setState("wait");
    setMsg("Warte auf STOP …");
    clearTimeout(timerRef.current);
    const delay = 900 + Math.random() * 2200; // 0.9–3.1s
    timerRef.current = setTimeout(() => {
      setState("stop");
      setMsg("STOP!");
    }, delay);
  };

  useEffect(() => {
    schedule();
    return () => clearTimeout(timerRef.current);
  }, []);

  const tap = () => {
    if (state === "wait") {
      setMsg("Zu früh! 0 Punkte");
      // kurze Pause, dann neu
      setTimeout(schedule, 800);
      return;
    }
    if (state === "stop") {
      onScore(10);
      setMsg("Gute Reaktion! +10");
      setTimeout(schedule, 800);
    }
  };

  return (
    <div style={styles.center}>
      <div style={styles.title}>Bremsentest</div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>{msg}</div>
      <button style={styles.btn} onClick={tap}>TAP</button>
      <div style={{ marginTop: 8, color: "#cbd5e1" }}>
        Tipp erst, wenn „STOP!“ erscheint.
      </div>
    </div>
  );
}

const styles = {
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 12,
    minHeight: 260,
  },
  title: { fontSize: 26, fontWeight: 800 },
  btn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 14,
    padding: "14px 24px",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 20,
    boxShadow: "0 6px 20px rgba(0,0,0,.25)",
  },
};