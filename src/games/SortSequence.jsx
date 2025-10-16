import React, { useMemo, useState } from "react";

export default function SortSequence({ onScore }) {
  // zufällige Zahlenreihe pro Runde
  const initial = useMemo(
    () => [12, 27, 5, 33, 19].sort(() => Math.random() - 0.5),
    []
  );
  const [items, setItems] = useState(initial);
  const [dragIndex, setDragIndex] = useState(null);

  const onDragStart = (idx) => (e) => {
    setDragIndex(idx);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (idx) => (e) => {
    e.preventDefault(); // droppen erlauben
    if (dragIndex === null || dragIndex === idx) return;
    // Element live verschieben (Reihenfolge zeigen)
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(idx, 0, moved);
    setItems(next);
    setDragIndex(idx);
  };

  const onDrop = () => {
    // prüfen ob sortiert
    const sorted = [...items].sort((a, b) => a - b);
    const ok = items.every((v, i) => v === sorted[i]);
    if (ok) {
      onScore(12);
      // neue Runde
      const fresh = [12, 27, 5, 33, 19].sort(() => Math.random() - 0.5);
      setItems(fresh);
      setDragIndex(null);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.title}>Rechnung sortieren</div>
      <div style={{ opacity: 0.9, marginBottom: 6 }}>
        Ziehe die Kärtchen in <b>aufsteigende</b> Reihenfolge.
      </div>

      <div style={styles.list} onDrop={onDrop} onDragOver={(e)=>e.preventDefault()}>
        {items.map((n, idx) => (
          <div
            key={idx + "-" + n}
            draggable
            onDragStart={onDragStart(idx)}
            onDragOver={onDragOver(idx)}
            style={{
              ...styles.item,
              outline: idx === dragIndex ? "2px solid #2563eb" : "2px solid #334155",
            }}
          >
            <span style={{ fontWeight: 900, fontSize: 22 }}>{n}</span>
            <span style={{ opacity: 0.7 }}>⠿</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 6, color: "#cbd5e1" }}>
        Tipp: Halten & ziehen – beim Loslassen wird geprüft.
      </div>
    </div>
  );
}

const styles = {
  wrap: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8, minHeight: 260 },
  title: { fontSize: 26, fontWeight: 800 },
  list: { width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 8, marginTop: 8 },
  item: {
    background: "#0b1220",
    color: "#e5e7eb",
    borderRadius: 12,
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "grab",
    userSelect: "none",
  },
};