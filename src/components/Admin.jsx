// src/components/Admin.jsx
import React, { useEffect, useMemo, useState } from "react";
import { adminListScores, adminSetVisible, adminHideGame } from "../lib/supabase-admin";

const GAME_LABELS = {
  QUIZ: "Werkstatt-Quiz",
  TAP_FRENZY: "Ölwechsel 3000",
  SWIPE_APPROVAL: "Garantiehölle",
  SORT_SEQUENCE: "Rechnungs-Sortierer",
  BRAKE_TEST: "Bremsentest",
  CODE_TYPER: "Code-Tipper",
};
const GAMES = [null, ...Object.keys(GAME_LABELS)]; // null = alle

export default function Admin({ onBack, username }) {
  const [game, setGame] = useState(null);
  const [rows, setRows] = useState([]);
  const [state, setState] = useState("idle"); // idle|loading|ok|error
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(r =>
      (r.player_name || "").toLowerCase().includes(s) ||
      (r.user_id || "").toLowerCase().includes(s)
    );
  }, [rows, search]);

  const load = async () => {
    setState("loading");
    const { data, error } = await adminListScores({ game, limit: 1000 });
    if (error) { setState("error"); setRows([]); }
    else { setRows(data || []); setState("ok"); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [game]);

  const toggleVisible = async (id, visible) => {
    await adminSetVisible(id, visible);
    await load();
  };

  const resetGame = async () => {
    if (!game) { alert("Bitte zuerst ein Spiel im Filter wählen."); return; }
    if (!confirm(`Alle sichtbaren Scores für "${GAME_LABELS[game]}" ausblenden?`)) return;
    await adminHideGame(game);
    await load();
  };

  const exportCSV = () => {
    const headers = ["id","player_name","game_name","score","user_id","created_at","visible"];
    const lines = [headers.join(",")].concat(
      filtered.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","))
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `scores_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>🛠️ Admin – Scores</h2>
        <div style={styles.right}>
          <button className="btn" style={styles.btnGhost} onClick={onBack}>Zurück</button>
        </div>
      </div>

      <div style={styles.toolbar}>
        <select
          value={game ?? ""}
          onChange={(e) => setGame(e.target.value || null)}
          style={styles.select}
        >
          <option value="">Alle Spiele</option>
          {Object.keys(GAME_LABELS).map(g => (
            <option key={g} value={g}>{GAME_LABELS[g]}</option>
          ))}
        </select>

        <input
          placeholder="Suche: Spielername oder user_id"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <button className="btn" style={styles.btn} onClick={load}>Aktualisieren</button>
        <button className="btn" style={styles.btnDanger} onClick={resetGame} disabled={!game}>
          Spiel zurücksetzen (soft)
        </button>
        <button className="btn" style={styles.btnGhost} onClick={exportCSV}>CSV Export</button>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Spieler</th>
              <th>Spiel</th>
              <th>Score</th>
              <th>User ID</th>
              <th>Datum</th>
              <th>Sichtbar</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {state === "loading" && (
              <tr><td colSpan="8" style={styles.muted}>Lade…</td></tr>
            )}
            {state === "error" && (
              <tr><td colSpan="8" style={styles.muted}>Fehler beim Laden.</td></tr>
            )}
            {state === "ok" && filtered.length === 0 && (
              <tr><td colSpan="8" style={styles.muted}>Keine Einträge.</td></tr>
            )}
            {state === "ok" && filtered.map(r => (
              <tr key={r.id}>
                <td style={styles.code}>{r.id}</td>
                <td>{r.player_name}</td>
                <td>{GAME_LABELS[r.game_name] || r.game_name}</td>
                <td style={{ fontWeight: 800 }}>{r.score}</td>
                <td style={styles.code}>{r.user_id || "-"}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>{r.visible ? "ja" : "nein"}</td>
                <td>
                  {r.visible ? (
                    <button className="btn" style={styles.btnDanger} onClick={() => toggleVisible(r.id, false)}>
                      Ausblenden
                    </button>
                  ) : (
                    <button className="btn" style={styles.btn} onClick={() => toggleVisible(r.id, true)}>
                      Einblenden
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.note}>
        Angemeldet als <b>{username}</b>. Admin-Funktionen sind im UI nur für „Alex“ sichtbar.
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    width: "min(1000px, calc(100vw - 32px))",
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 16,
    color: "#e5e7eb",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 10,
  },
  right: { display: "flex", gap: 8 },
  toolbar: {
    display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 10,
  },
  select: {
    background: "#0b1220", border: "2px solid #1f2937", color: "#e5e7eb",
    padding: "10px 12px", borderRadius: 10, minWidth: 220,
  },
  search: {
    background: "#0b1220", border: "2px solid #1f2937", color: "#e5e7eb",
    padding: "10px 12px", borderRadius: 10, minWidth: 260, flex: 1,
  },
  btn: {
    background: "#2563eb", borderRadius: 12, border: "none", color: "#fff",
    padding: "10px 12px", cursor: "pointer", fontWeight: 800,
  },
  btnGhost: {
    background: "transparent", borderRadius: 12, border: "2px solid #1f2937", color: "#e5e7eb",
    padding: "10px 12px", cursor: "pointer", fontWeight: 800,
  },
  btnDanger: {
    background: "#b91c1c", borderRadius: 12, border: "none", color: "#fff",
    padding: "10px 12px", cursor: "pointer", fontWeight: 800,
  },
  tableWrap: { overflowX: "auto", borderRadius: 12, border: "2px solid #1f2937" },
  table: {
    width: "100%", borderCollapse: "collapse",
  },
  code: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12 },
  muted: { textAlign: "center", color: "#cbd5e1", padding: 12 },
  note: { marginTop: 10, fontSize: 13, color: "#cbd5e1" },
};