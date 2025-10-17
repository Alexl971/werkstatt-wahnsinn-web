import React, { useEffect, useState } from "react";
import { fetchTopByGame } from "../lib/supabase-best";

const GAME_LABELS = {
  QUIZ: "Werkstatt-Quiz",
  TAP_FRENZY: "Ölwechsel 3000",
  SWIPE_APPROVAL: "Garantiehölle",
  SORT_SEQUENCE: "Rechnungs-Sortierer",
  BRAKE_TEST: "Bremsentest",
  CODE_TYPER: "Code-Tipper",
};

const GAMES = Object.keys(GAME_LABELS);

export default function Highscores({ onBack }) {
  const [active, setActive] = useState(GAMES[0]);
  const [rows, setRows] = useState([]);
  const [state, setState] = useState("loading"); // loading | ok | error
  const [errText, setErrText] = useState("");

  const load = async (game) => {
    setState("loading");
    const { data, error } = await fetchTopByGame(game, 50);
    if (error) {
      console.error("[Highscores] fetchTopByGame error:", error);
      setErrText(error.message || String(error));
      setRows([]);
      setState("error");
    } else {
      setRows(data || []);
      setState("ok");
    }
  };

  useEffect(() => { load(active); }, [active]);

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>🏆 Highscores</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={styles.btn} onClick={() => load(active)}>Aktualisieren</button>
          <button style={styles.btnSecondary} onClick={onBack}>Zurück</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {GAMES.map((g) => {
          const isActive = g === active;
          return (
            <button
              key={g}
              onClick={() => setActive(g)}
              style={{
                ...styles.tab,
                background: isActive ? "#2563eb" : "#0b1220",
                borderColor: isActive ? "#2563eb" : "#1f2937",
                color: isActive ? "#fff" : "#e5e7eb",
              }}
            >
              {GAME_LABELS[g]}
            </button>
          );
        })}
      </div>

      {/* Liste */}
      <div style={styles.card}>
        <div style={styles.titleRow}>
          <div style={{ fontWeight: 800 }}>{GAME_LABELS[active]}</div>
          <div style={{ opacity: 0.8, fontSize: 13 }}>bester Score je Spieler</div>
        </div>

        {state === "loading" && <div style={styles.muted}>Lade …</div>}
        {state === "error" && (
          <div style={styles.muted}>
            Konnte Highscores nicht laden.<br />
            <small style={{opacity:.85}}>Fehler: {errText}</small>
          </div>
        )}

        {state === "ok" && (
          rows.length ? (
            <ol style={styles.list}>
              {rows.map((r, i) => (
                <li key={i} style={styles.row}>
                  <span style={styles.rank}>{i + 1}.</span>
                  <span style={styles.name}>{r.player_name}</span>
                  <span style={styles.points}>{r.score}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div style={styles.muted}>Noch keine Einträge – hol dir Platz 1! 🚀</div>
          )
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: { width: "100%", maxWidth: 900, color: "#e5e7eb" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  tabs: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 8, marginBottom: 12 },
  tab: { padding: "10px 12px", borderRadius: 12, border: "2px solid #1f2937", background: "#0b1220", cursor: "pointer", fontWeight: 700, textAlign: "center" },
  card: { background: "#111827", border: "2px solid #1f2937", borderRadius: 18, padding: 14 },
  titleRow: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
  list: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 },
  row: { display: "grid", gridTemplateColumns: "44px 1fr 80px", alignItems: "center", gap: 8, background: "#0b1220", border: "2px solid #1f2937", borderRadius: 12, padding: "8px 10px" },
  rank: { fontWeight: 900, textAlign: "right", color: "#93c5fd" },
  name: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  points: { textAlign: "right", fontWeight: 800, color: "#38bdf8" },
  muted: { color: "#cbd5e1", opacity: 0.8, textAlign: "center", padding: 12 },
  btn: { background: "#2563eb", borderRadius: 12, border: "none", color: "white", padding: "8px 12px", cursor: "pointer", fontWeight: 700 },
  btnSecondary: { background: "#334155", borderRadius: 12, border: "none", color: "#e5e7eb", padding: "8px 12px", cursor: "pointer", fontWeight: 700 },
};