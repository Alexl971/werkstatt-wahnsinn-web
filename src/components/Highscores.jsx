import React, { useEffect, useState } from "react";
import { fetchTop } from "../lib/supabase";

export default function Highscores({ onBack }) {
  const [rows, setRows] = useState([]);
  const [state, setState] = useState("loading"); // loading | ok | error

  const load = async () => {
    setState("loading");
    const { data, error } = await fetchTop(50);
    if (error) {
      setState("error");
    } else {
      setRows(data || []);
      setState("ok");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>🏆 Highscores</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={styles.btn} onClick={load}>Aktualisieren</button>
          <button style={styles.btnSecondary} onClick={onBack}>Zurück</button>
        </div>
      </div>

      {state === "loading" && <div style={styles.muted}>Lade …</div>}
      {state === "error" && (
        <div style={styles.muted}>
          Konnte Highscores nicht laden. Prüfe Environment-Variablen / Tabelle.
        </div>
      )}

      {state === "ok" && (
        <ol style={styles.list}>
          {rows.map((r, i) => (
            <li key={r.id || i} style={styles.row}>
              <span style={styles.rank}>{i + 1}.</span>
              <span style={styles.name}>{r.name}</span>
              <span style={styles.points}>{r.points} P</span>
            </li>
          ))}
          {rows.length === 0 && (
            <div style={styles.muted}>Noch keine Einträge – hol dir den ersten Platz! 🚀</div>
          )}
        </ol>
      )}
    </div>
  );
}

const styles = {
  card: {
    width: "100%",
    maxWidth: 560,
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 16,
    color: "#e5e7eb",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  list: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 },
  row: {
    display: "grid",
    gridTemplateColumns: "44px 1fr 80px",
    alignItems: "center",
    gap: 8,
    background: "#0b1220",
    border: "2px solid #1f2937",
    borderRadius: 12,
    padding: "8px 10px",
  },
  rank: { fontWeight: 900, textAlign: "right", color: "#93c5fd" },
  name: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  points: { textAlign: "right", fontWeight: 800 },
  muted: { color: "#cbd5e1", opacity: 0.8, textAlign: "center", padding: 12 },
  btn: {
    background: "#2563eb",
    borderRadius: 12,
    border: "none",
    color: "white",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  btnSecondary: {
    background: "#334155",
    borderRadius: 12,
    border: "none",
    color: "#e5e7eb",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
};