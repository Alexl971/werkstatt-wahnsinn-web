import React, { useState } from "react";

export default function TapFrenzy({ onScore }) {
  const [taps, setTaps] = useState(0);

  return (
    <div style={styles.center}>
      <div style={styles.title}>Ölwechsel 3000</div>
      <div style={{ opacity: 0.9 }}>Tippe so schnell wie möglich!</div>

      <button
        style={styles.bigBtn}
        onClick={() => {
          setTaps((n) => n + 1);
          onScore(1);
        }}
      >
        TAP
      </button>

      <div style={{ marginTop: 8 }}>Taps: {taps}</div>
    </div>
  );
}

const styles = {
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    textAlign: "center",
    padding: 10,
  },
  title: { fontSize: 26, fontWeight: 800 },
  bigBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 16,
    padding: "18px 36px",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 24,
    marginTop: 24,             // vorher 6 → deutlich weiter unten
    boxShadow: "0 6px 20px rgba(0,0,0,.25)",
  },
};