import React, { useMemo, useState } from "react";

export default function SortSequence({ onScore }) {
  const makeRound = () => [12, 27, 5, 33, 19].sort(() => Math.random() - 0.5);
  const [items, setItems] = useState(makeRound);
  const [picked, setPicked] = useState([]);           // values in click order
  const [msg, setMsg] = useState("");
  const [locked, setLocked] = useState(false);

  const sorted = useMemo(() => [...items].sort((a, b) => a - b), [items]);

  const onClick = (val) => {
    if (locked) return;
    if (picked.includes(val)) return; // already chosen
    const next = [...picked, val];
    setPicked(next);

    if (next.length === items.length) {
      // evaluate
      const ok = next.every((v, i) => v === sorted[i]);
      setLocked(true);
      if (ok) {
        setMsg("✅ Richtig! +12");
        onScore(12);
        setTimeout(() => {
          setItems(makeRound());
          setPicked([]);
          setMsg("");
          setLocked(false);
        }, 700);
      } else {
        setMsg("❌ Falsche Reihenfolge – versuch’s nochmal.");
        setTimeout(() => {
          setPicked([]);
          setMsg("");
          setLocked(false);
        }, 800);
      }
    }
  };

  const pickIndex = (val) => picked.indexOf(val); // -1 if not selected yet

  return (
    <div style={styles.wrap}>
      <div style={styles.title}>Rechnung sortieren</div>
      <div style={{ opacity: 0.9, marginBottom: 6 }}>
        Klicke die Kärtchen in <b>aufsteigender</b> Reihenfolge an.
      </div>

      <div style={styles.grid}>
        {items.map((val) => {
          const i = pickIndex(val);
          const selected = i !== -1;
          return (
            <button
              key={val}
              onClick={() => onClick(val)}
              disabled={locked}
              style={{
                ...styles.item,
                outline: selected ? "2px solid #2563eb" : "2px solid #334155",
                opacity: selected ? 0.9 : 1,
                cursor: locked ? "not-allowed" : "pointer",
              }}
            >
              <span style={{ fontWeight: 900, fontSize: 22 }}>{val}</span>
              <span style={{ opacity: 0.7 }}>⠿</span>

              {/* order badge */}
              {selected && (
                <span style={styles.badge}>
                  {i + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 8, color: "#cbd5e1", minHeight: 22 }}>{msg}</div>
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 8,
    minHeight: 260,
  },
  title: { fontSize: 26, fontWeight: 800 },
  grid: {
    width: "100%",
    maxWidth: 520,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginTop: 8,
  },
  item: {
    position: "relative",
    background: "#0b1220",
    color: "#e5e7eb",
    borderRadius: 12,
    padding: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    userSelect: "none",
  },
  badge: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 28,
    height: 28,
    borderRadius: 999,
    background: "#2563eb",
    color: "white",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    boxShadow: "0 6px 16px rgba(0,0,0,.35)",
    border: "2px solid #1f2937",
  },
};