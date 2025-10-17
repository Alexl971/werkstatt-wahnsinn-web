import React, { useEffect, useMemo, useState } from "react";
import { fetchTopByGame } from "../lib/supabase-best"; // oder "../lib/supabase" falls kombiniert

const GAME_LABELS = {
  QUIZ: "Werkstatt-Quiz",
  TAP_FRENZY: "Ölwechsel 3000",
  SWIPE_APPROVAL: "Garantiehölle",
  SORT_SEQUENCE: "Rechnungs-Sortierer",
  BRAKE_TEST: "Bremsentest",
  CODE_TYPER: "Code-Tipper",
};

const GAMES = Object.keys(GAME_LABELS);

// Hilfsfunktionen für Filter
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function startOfLast7Days() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - 6); // Heute + 6 Tage zurück = letzte 7 Tage
  return d;
}

export default function Highscores({ onBack, currentPlayer }) {
  const [active, setActive] = useState(GAMES[0]);
  const [rows, setRows] = useState([]);
  const [state, setState] = useState("loading"); // loading | ok | error
  const [errText, setErrText] = useState("");
  const [range, setRange] = useState("ALL"); // ALL | TODAY | WEEK

  const title = GAME_LABELS[active] ?? active;

  const load = async (game) => {
    setState("loading");
    const { data, error } = await fetchTopByGame(game, 200);
    if (error) {
      console.error("[Highscores] fetchTopByGame error:", error);
      setErrText(error.message || String(error));
      setRows([]);
      setState("error");
    } else {
      setRows(Array.isArray(data) ? data : []);
      setState("ok");
    }
  };

  useEffect(() => { load(active); }, [active]);

  // Clientseitiges Filtern nach Zeitraum
  const filtered = useMemo(() => {
    if (range === "ALL") return rows;
    const cutoff =
      range === "TODAY" ? startOfToday() :
      range === "WEEK"  ? startOfLast7Days() : null;
    if (!cutoff) return rows;
    const t = cutoff.getTime();
    return rows.filter(r => {
      const ts = new Date(r.created_at).getTime();
      return Number.isFinite(ts) && ts >= t;
    });
  }, [rows, range]);

  // Podium + Rest aus gefilterten Datensätzen
  const podium = useMemo(() => filtered.slice(0, 3), [filtered]);
  const rest   = useMemo(() => filtered.slice(3), [filtered]);

  const normName = (s) => (s || "").trim().toLowerCase();
  const me = normName(currentPlayer);

  return (
    <div style={styles.wrap}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>🏆 Highscores</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={styles.btn} onClick={() => load(active)}>Aktualisieren</button>
          <button style={styles.btnSecondary} onClick={onBack}>Zurück</button>
        </div>
      </div>

      {/* Tabs Spiele */}
      <div style={styles.tabs}>
        {GAMES.map((g) => {
          const isActive = g === active;
          return (
            <button
              key={g}
              onClick={() => setActive(g)}
              style={{
                ...styles.tab,
                background: isActive ? "linear-gradient(180deg,#2563eb,#1d4ed8)" : "#0b1220",
                borderColor: isActive ? "#2563eb" : "#1f2937",
                color: isActive ? "#fff" : "#e5e7eb",
              }}
            >
              {GAME_LABELS[g]}
            </button>
          );
        })}
      </div>

      {/* Filter-Zeile */}
      <div style={styles.filters}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <FilterPill label="Heute"   active={range==="TODAY"} onClick={() => setRange("TODAY")} />
          <FilterPill label="Diese Woche" active={range==="WEEK"}  onClick={() => setRange("WEEK")} />
          <FilterPill label="Allzeit"  active={range==="ALL"}   onClick={() => setRange("ALL")} />
        </div>
        <div style={styles.hint}>
          <small style={{opacity:.8}}>
            Zeitraum-Filter wird clientseitig angewendet.
          </small>
        </div>
      </div>

      <div style={styles.card}>
        {/* Titelzeile */}
        <div style={styles.titleRow}>
          <div style={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={styles.badgeTitle}>{title}</span>
            <span style={styles.subtle}>bester Score je Spieler</span>
          </div>
          <div style={styles.glowDot} />
        </div>

        {/* Status */}
        {state === "loading" && <div style={styles.muted}>Lade …</div>}
        {state === "error" && (
          <div style={styles.muted}>
            Konnte Highscores nicht laden.
            <br /><small style={{opacity:.85}}>{errText}</small>
          </div>
        )}

        {state === "ok" && (
          <>
            {/* Podium Top 3 */}
            <div style={styles.podium}>
              {podium.map((r, i) => (
                <PodiumCard
                  key={i}
                  rank={i + 1}
                  name={r.player_name}
                  score={r.score}
                  highlight={me && normName(r.player_name) === me}
                />
              ))}
              {podium.length === 0 && (
                <div style={styles.muted}>Noch keine Einträge – hol dir Platz 1! 🚀</div>
              )}
            </div>

            {/* Liste Rest */}
            {rest.length > 0 && (
              <ol style={styles.list}>
                {rest.map((r, i) => {
                  const rank = i + 4;
                  const isMe = me && normName(r.player_name) === me;
                  return (
                    <li
                      key={rank}
                      style={{
                        ...styles.row,
                        ...(rank % 2 === 0 ? styles.rowAlt : null),
                        ...(isMe ? styles.rowMe : null),
                      }}
                    >
                      <span style={styles.rank}>{rank}.</span>
                      <div style={styles.person}>
                        <Avatar name={r.player_name} size={28} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.player_name}
                          {isMe && <span style={styles.mePill}>du</span>}
                        </span>
                      </div>
                      <span style={styles.points}>{r.score}</span>
                    </li>
                  );
                })}
              </ol>
            )}

            {rest.length === 0 && podium.length > 0 && (
              <div style={{ ...styles.muted, marginTop: 8 }}>Das war schon alles ✌️</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ====== kleine UI-Teile ====== */

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 12px",
        borderRadius: 999,
        border: "2px solid",
        borderColor: active ? "#2563eb" : "#1f2937",
        background: active ? "linear-gradient(180deg,#2563eb,#1d4ed8)" : "#0b1220",
        color: active ? "#fff" : "#e5e7eb",
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function PodiumCard({ rank, name, score, highlight }) {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";
  const tone =
    rank === 1 ? ["#fde68a", "#f59e0b"] :
    rank === 2 ? ["#e5e7eb", "#9ca3af"] :
                 ["#fda4af", "#fb7185"];

  return (
    <div
      style={{
        ...styles.podiumCard,
        background: `linear-gradient(180deg, ${tone[0]}22, ${tone[1]}22)`,
        borderColor: `${tone[1]}55`,
        boxShadow: `inset 0 0 0 1px ${tone[0]}33, 0 6px 20px ${tone[1]}22`,
        outline: highlight ? "2px solid #22c55e" : "none",
      }}
      title={name}
    >
      <div style={styles.medal}>{medal}</div>
      <Avatar name={name} size={44} />
      <div style={styles.podiumName}>{name}</div>
      <div style={styles.podiumScore}>{score}</div>
    </div>
  );
}

function Avatar({ name, size = 32 }) {
  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
  return (
    <div
      style={{
        width: size, height: size, borderRadius: 999,
        background: "linear-gradient(135deg,#1f2937,#0b1220)",
        border: "1px solid #334155",
        color: "#e5e7eb", display: "grid", placeItems: "center",
        fontWeight: 800, fontSize: size * 0.38, letterSpacing: .5,
      }}
    >
      {initials || "?"}
    </div>
  );
}

/* ====== Styles ====== */

const styles = {
  wrap: { width: "100%", maxWidth: 980, color: "#e5e7eb" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },

  tabs: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 8, marginBottom: 10 },

  filters: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  hint: { color: "#94a3b8" },

  tab: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "2px solid #1f2937",
    background: "#0b1220",
    cursor: "pointer",
    fontWeight: 700,
    textAlign: "center",
  },
  card: {
    background: "linear-gradient(180deg, #0b1220, #0a1324)",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 14,
    position: "relative",
    overflow: "hidden",
  },
  titleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  badgeTitle: { background: "#0b1220", border: "2px solid #1f2937", borderRadius: 12, padding: "6px 10px" },
  subtle: { opacity: 0.8, fontSize: 13, marginLeft: 6 },
  glowDot: { width: 10, height: 10, borderRadius: 999, background: "#22c55e", boxShadow: "0 0 18px #22c55e" },

  podium: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12, marginBottom: 12 },
  podiumCard: { border: "2px solid transparent", borderRadius: 16, padding: 12, display: "grid", placeItems: "center", gap: 8, minHeight: 150 },
  medal: { fontSize: 22 },
  podiumName: { maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 800 },
  podiumScore: { fontWeight: 900, fontSize: 22, color: "#38bdf8" },

  list: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 },
  row: {
    display: "grid",
    gridTemplateColumns: "44px 1fr 100px",
    alignItems: "center",
    gap: 8,
    background: "#0b1220",
    border: "2px solid #1f2937",
    borderRadius: 12,
    padding: "8px 10px",
  },
  rowAlt: { background: "#0c1528" },
  rowMe: { outline: "2px solid #22c55e", outlineOffset: 2 },
  rank: { fontWeight: 900, textAlign: "right", color: "#93c5fd" },
  person: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
  points: { textAlign: "right", fontWeight: 900, color: "#38bdf8" },
  muted: { color: "#cbd5e1", opacity: 0.8, textAlign: "center", padding: 12 },

  btn: { background: "#2563eb", borderRadius: 12, border: "none", color: "white", padding: "8px 12px", cursor: "pointer", fontWeight: 700 },
  btnSecondary: { background: "#334155", borderRadius: 12, border: "none", color: "#e5e7eb", padding: "8px 12px", cursor: "pointer", fontWeight: 700 },

  mePill: {
    marginLeft: 8, fontSize: 12, padding: "2px 6px", borderRadius: 999,
    background: "#16a34a22", border: "1px solid #16a34a55", color: "#bbf7d0", fontWeight: 800,
  },
};