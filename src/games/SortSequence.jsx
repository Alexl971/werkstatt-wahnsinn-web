import React, { useMemo, useRef, useState } from "react";

export default function SortSequence({ onScore }) {
  // zufällige Startreihenfolge
  const initial = useMemo(
    () => [12, 27, 5, 33, 19].sort(() => Math.random() - 0.5),
    []
  );
  const [items, setItems] = useState(initial);

  // Drag-States
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState(0); // px
  const itemRefs = useRef([]);

  // Hilfsfunktion: Index unter dem Pointer finden
  const getIndexFromClientY = (clientY) => {
    const rects = itemRefs.current.map((el) => el?.getBoundingClientRect?.()).filter(Boolean);
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      const mid = r.top + r.height / 2;
      if (clientY < mid) return i;
    }
    return rects.length - 1;
  };

  const onPointerDown = (idx) => (e) => {
    // Pointer-Events aktivieren
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragIndex(idx);
    setDragOffset(0);
  };

  const onPointerMove = (e) => {
    if (dragIndex === null) return;
    // Scrollen unterdrücken bei Touch
    if (e.pointerType === "touch") e.preventDefault();

    // Offset anzeigen (für visuelles Feedback)
    const currentRect = itemRefs.current[dragIndex]?.getBoundingClientRect?.();
    if (!currentRect) return;
    const delta = e.clientY - (currentRect.top + currentRect.height / 2);
    setDragOffset(delta);

    // Zielindex bestimmen und ggf. live umsortieren
    const overIndex = getIndexFromClientY(e.clientY);
    if (overIndex !== dragIndex) {
      const next = [...items];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(overIndex, 0, moved);
      setItems(next);
      setDragIndex(overIndex);
      setDragOffset(0);
    }
  };

  const onPointerUp = () => {
    if (dragIndex === null) return;
    setDragIndex(null);
    setDragOffset(0);

    // Nach Loslassen: prüfen ob sortiert
    const sorted = [...items].sort((a, b) => a - b);
    const ok = items.every((v, i) => v === sorted[i]);
    if (ok) {
      onScore(12);
      // neue Runde
      const fresh = [12, 27, 5, 33, 19].sort(() => Math.random() - 0.5);
      setItems(fresh);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.title}>Rechnung sortieren</div>
      <div style={{ opacity: 0.9, marginBottom: 6 }}>
        Ziehe die Kärtchen in <b>aufsteigende</b> Reihenfolge.
      </div>

      <div
        style={styles.list}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {items.map((n, idx) => {
          const isDragging = idx === dragIndex;
          return (
            <div
              key={idx + "-" + n}
              ref={(el) => (itemRefs.current[idx] = el)}
              style={{
                ...styles.item,
                outline: isDragging ? "2px solid #2563eb" : "2px solid #334155",
                position: "relative",
                zIndex: isDragging ? 2 : 1,
                transform: isDragging ? `translateY(${dragOffset}px)` : "none",
                touchAction: "none", // wichtig für mobile Drag
              }}
              onPointerDown={onPointerDown(idx)}
            >
              <span style={{ fontWeight: 900, fontSize: 22 }}>{n}</span>
              <span style={{ opacity: 0.7 }}>⠿</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 6, color: "#cbd5e1" }}>
        Tipp: Halten & ziehen – beim Loslassen wird geprüft.
      </div>
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
  list: {
    width: "100%",
    maxWidth: 520,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 8,
    // verhindert, dass Safari bei Touch-Drag scrollt
    touchAction: "none",
  },
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