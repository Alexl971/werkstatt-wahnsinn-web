import React, { useState } from "react";

export default function TapFrenzy({ onScore }) {
  const [taps, setTaps] = useState(0);

  return (
    <div style={styles.center}>
      <div style={styles.title}>Ölwechsel 3000</div>
      <div>Tippe so schnell wie möglich!</div>
      <button
        style={styles.btn}
        onClick={() => {
          setTaps((n) => n + 1);
          onScore(1);
        }}
      >
        TAP
      </button>
      <div>Taps: {taps}</div>
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
    padding: 10,
  },
  title: { fontSize: 24, fontWeight: 800 },
  btn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: 700,
    marginTop: 8,
  },
};