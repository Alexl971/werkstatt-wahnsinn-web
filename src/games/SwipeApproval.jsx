import React, { useEffect, useMemo, useRef, useState } from "react";

const CLAIMS = [
  { t: "Kupplung nach 95.000 km", d: "„Fehler seit gestern“", hint: "Verschleißteil?", ok: false },
  { t: "Sensor defekt nach 1 Monat", d: "Fehlercode P1DB7-00", hint: "Frühzeitiger Ausfall", ok: true },
  { t: "Kaffee im Infotainment", d: "Touch reagiert nicht", hint: "Flüssigkeitsschaden", ok: false },
  { t: "Batterie tot nach 3 Monaten", d: "Ticket 1840792 vorhanden", hint: "Bekannter Fehler", ok: true },
];

export default function SwipeApproval({ onScore }) {
  const deck = useMemo(() => CLAIMS.sort(() => Math.random() - 0.5), []);
  const [i, setI] = useState(0);
  const [dx, setDx] = useState(0);
  const cardRef = useRef(null);

  const apply = (dir) => {
    const c = deck[i % deck.length];
    const correct = (dir === "approve" && c.ok) || (dir === "reject" && !c.ok);
    if (correct) onScore(5);
    setI((n) => n + 1);
    setDx(0);
  };

  // Maus/Touch-Drag
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    let startX = 0;
    let active = false;

    const onDown = (e) => {
      active = true;
      startX = "touches" in e ? e.touches[0].clientX : e.clientX;
    };
    const onMove = (e) => {
      if (!active) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      setDx(x - startX);
    };
    const onUp = () => {
      if (!active) return;
      if (dx > 90) apply("approve");
      else if (dx < -90) apply("reject");
      else setDx(0);
      active = false;
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dx, i, deck]);

  const c = deck[i % deck.length];

  return (
    <div style={styles.wrap}>
      <div style={styles.title}>Garantie-Hölle</div>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 520, marginBottom: 6 }}>
        <span style={{ color: "#ef4444", opacity: dx < 0 ? Math.min(1, Math.abs(dx) / 100) : 0 }}>ABLEHNEN ⬅️</span>
        <span style={{ color: "#10b981", opacity: dx > 0 ? Math.min(1, Math.abs(dx) / 100) : 0 }}>➡️ GENEHMIGEN</span>
      </div>

      <div
        ref={cardRef}
        style={{
          ...styles.card,
          transform: `translateX(${dx}px) rotate(${dx / 30}deg)`,
          transition: dx === 0 ? "transform .15s ease" : "none",
        }}
      >
        <div style={styles.cardTitle}>{c.t}</div>
        <div style={styles.lineLight}>{c.d}</div>
        <div style={{ ...styles.lineLight, marginTop: 8 }}>Hinweis: {c.hint}</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button style={styles.btnReject} onClick={() => apply("reject")}>Ablehnen</button>
        <button style={styles.btnApprove} onClick={() => apply("approve")}>Genehmigen</button>
      </div>
    </div>
  );
}

const styles = {
  wrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minHeight: 260, color: "#e5e7eb" },
  title: { fontSize: 26, fontWeight: 800 },
  card: {
    width: "100%", maxWidth: 520,
    background: "#0b1220",
    border: "2px solid #1f2937",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,.25)",
  },
  cardTitle: { fontSize: 20, fontWeight: 800, marginBottom: 6, color: "#e5e7eb" },
  lineLight: { color: "#cbd5e1" },
  btnReject: {
    background: "#ef4444", color: "white", border: "none", borderRadius: 12, padding: "10px 16px",
    cursor: "pointer", fontWeight: 700,
  },
  btnApprove: {
    background: "#10b981", color: "white", border: "none", borderRadius: 12, padding: "10px 16px",
    cursor: "pointer", fontWeight: 700,
  },
};