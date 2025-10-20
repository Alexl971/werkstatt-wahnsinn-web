// src/components/Admin.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  adminListScores,
  adminSetVisible,
  adminBulkVisible,
  adminDeleteScores,
  adminHideGame,
  adminListUsers,
  adminHideUserScores,
  adminAnonymizeUserScores,
  adminDeleteUser,
} from "../lib/supabase-admin";
import {
  listQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  setQuestionVisible,
} from "../lib/supabase-quiz";

const GAME_LABELS = {
  QUIZ: "Werkstatt-Quiz",
  TAP_FRENZY: "Ölwechsel 3000",
  SWIPE_APPROVAL: "Garantiehölle",
  SORT_SEQUENCE: "Rechnungs-Sortierer",
  BRAKE_TEST: "Bremsentest",
  CODE_TYPER: "Code-Tipper",
};

const TABS = ["scores", "users", "questions"];

export default function Admin({ onBack, username }) {
  const [tab, setTab] = useState("scores");

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>🛠️ Admin</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button
              key={t}
              className="btn"
              style={{ ...styles.tabBtn, ...(tab === t ? styles.tabBtnActive : {}) }}
              onClick={() => setTab(t)}
            >
              {t === "scores" ? "Scores" : t === "users" ? "Users" : "Questions"}
            </button>
          ))}
          <button className="btn" style={styles.btnGhost} onClick={onBack}>Zurück</button>
        </div>
      </div>

      {tab === "scores" && <ScoresAdmin />}
      {tab === "users" && <UsersAdmin />}
      {tab === "questions" && <QuestionsAdmin />}

      <div style={styles.note}>Angemeldet als <b>{username}</b>. Admin-UI ist im Frontend nur für „Alex“ sichtbar.</div>
    </div>
  );
}

/* -------------------- Scores Tab -------------------- */
function ScoresAdmin() {
  const [game, setGame] = useState("");
  const [days, setDays] = useState("7");
  const [visible, setVisible] = useState("all");
  const [state, setState] = useState("idle");
  const [rows, setRows] = useState([]);
  const [sort, setSort] = useState({ key: "created_at", dir: "desc" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [sel, setSel] = useState(new Set());

  const load = async () => {
    setState("loading");
    const { data, error } = await adminListScores({
      game: game || null,
      days: days ? Number(days) : null,
      visible: visible === "all" ? "all" : visible === "true",
      limit: 5000,
    });
    if (error) { setRows([]); setState("error"); }
    else { setRows(data || []); setState("ok"); setPage(1); setSel(new Set()); }
  };
  useEffect(() => { load(); /*eslint-disable*/ }, [game, days, visible]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    let arr = rows;
    if (s) {
      arr = arr.filter(r =>
        (r.player_name || "").toLowerCase().includes(s) ||
        (r.user_id || "").toLowerCase().includes(s)
      );
    }
    const dirMul = sort.dir === "asc" ? 1 : -1;
    arr = [...arr].sort((a, b) => {
      const va = a[sort.key];
      const vb = b[sort.key];
      if (sort.key === "score") return (va - vb) * dirMul;
      return (new Date(va) - new Date(vb)) * dirMul;
    });
    return arr;
  }, [rows, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelect = (id) => {
    const next = new Set(sel);
    next.has(id) ? next.delete(id) : next.add(id);
    setSel(next);
  };
  const selectAllPage = () => setSel(new Set(pageRows.map(r => r.id)));
  const clearSel = () => setSel(new Set());

  const bulkSetVis = async (vis) => {
    if (!sel.size) return;
    await adminBulkVisible(Array.from(sel), vis);
    await load();
  };
  const bulkDelete = async () => {
    if (!sel.size) return;
    if (!confirm(`Wirklich ${sel.size} Einträge LÖSCHEN?`)) return;
    await adminDeleteScores(Array.from(sel));
    await load();
  };
  const softResetGame = async () => {
    if (!game) { alert("Bitte zuerst ein Spiel wählen."); return; }
    if (!confirm(`Alle sichtbaren Scores für "${GAME_LABELS[game] || game}" ausblenden?`)) return;
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
    a.href = url; a.download = `scores_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSort = (key) => {
    setSort((s) => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" });
  };

  return (
    <>
      <div style={styles.toolbar}>
        <select value={game} onChange={(e) => setGame(e.target.value)} style={styles.select}>
          <option value="">Alle Spiele</option>
          {Object.keys(GAME_LABELS).map(g => <option key={g} value={g}>{GAME_LABELS[g]}</option>)}
        </select>

        <select value={days} onChange={(e) => setDays(e.target.value)} style={styles.select}>
          <option value="7">Letzte 7 Tage</option>
          <option value="30">Letzte 30 Tage</option>
          <option value="">Alle</option>
        </select>

        <select value={visible} onChange={(e) => setVisible(e.target.value)} style={styles.select}>
          <option value="all">Alle</option>
          <option value="true">Nur sichtbare</option>
          <option value="false">Nur versteckte</option>
        </select>

        <input
          placeholder="Suche: Spielername oder user_id"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <button className="btn" style={styles.btn} onClick={load}>Aktualisieren</button>
        <button className="btn" style={styles.btnGhost} onClick={exportCSV}>CSV</button>
        <button className="btn" style={styles.btnWarn} onClick={softResetGame} disabled={!game}>Spiel zurücksetzen (soft)</button>
      </div>

      <div style={styles.bulkBar}>
        <div>Ausgewählt: {sel.size}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" style={styles.btn} onClick={selectAllPage}>Seite auswählen</button>
          <button className="btn" style={styles.btnGhost} onClick={clearSel}>Auswahl leeren</button>
          <button className="btn" style={styles.btnOk} onClick={() => bulkSetVis(true)} disabled={!sel.size}>Einblenden</button>
          <button className="btn" style={styles.btnWarn} onClick={() => bulkSetVis(false)} disabled={!sel.size}>Ausblenden</button>
          <button className="btn" style={styles.btnDanger} onClick={bulkDelete} disabled={!sel.size}>Löschen</button>
        </div>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thNarrow}></th>
              <th>Spieler</th>
              <th>Spiel</th>
              <th style={styles.sortable} onClick={() => toggleSort("score")}>
                Score {sort.key === "score" ? (sort.dir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th>User ID</th>
              <th style={styles.sortable} onClick={() => toggleSort("created_at")}>
                Datum {sort.key === "created_at" ? (sort.dir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th>Sichtbar</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {state === "loading" && <tr><td colSpan="8" style={styles.muted}>Lade…</td></tr>}
            {state === "error" && <tr><td colSpan="8" style={styles.muted}>Fehler beim Laden.</td></tr>}
            {state === "ok" && pageRows.length === 0 && <tr><td colSpan="8" style={styles.muted}>Keine Einträge.</td></tr>}
            {state === "ok" && pageRows.map(r => (
              <tr key={r.id}>
                <td>
                  <input type="checkbox" checked={sel.has(r.id)} onChange={() => toggleSelect(r.id)} />
                </td>
                <td>{r.player_name}</td>
                <td>{GAME_LABELS[r.game_name] || r.game_name}</td>
                <td style={{ fontWeight: 800 }}>{r.score}</td>
                <td style={styles.code}>{r.user_id || "-"}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>{r.visible ? "ja" : "nein"}</td>
                <td>
                  {r.visible ? (
                    <button className="btn" style={styles.btnWarnSm} onClick={() => adminSetVisible(r.id, false).then(load)}>
                      Ausblenden
                    </button>
                  ) : (
                    <button className="btn" style={styles.btnOkSm} onClick={() => adminSetVisible(r.id, true).then(load)}>
                      Einblenden
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button className="btn" style={styles.btnGhost} disabled={page<=1} onClick={() => setPage(p => Math.max(1, p-1))}>Zurück</button>
        <div>Seite {page} / {pageCount}</div>
        <button className="btn" style={styles.btnGhost} disabled={page>=pageCount} onClick={() => setPage(p => Math.min(pageCount, p+1))}>Weiter</button>
      </div>
    </>
  );
}

/* -------------------- Users Tab -------------------- */
function UsersAdmin() {
  const [state, setState] = useState("idle");
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    setState("loading");
    const { data, error } = await adminListUsers({ limit: 2000 });
    if (error) { setRows([]); setState("error"); }
    else { setRows(data || []); setState("ok"); }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(r =>
      (r.username || "").toLowerCase().includes(s) ||
      (r.id || "").toLowerCase().includes(s)
    );
  }, [rows, search]);

  const hideScores = async (u) => { await adminHideUserScores(u.id); await load(); };
  const anonScores = async (u) => { await adminAnonymizeUserScores(u.id); await load(); };
  const deleteUser = async (u) => {
    if (!confirm(`User "${u.username}" wirklich LÖSCHEN?`)) return;
    await adminDeleteUser(u.id);
    await load();
  };

  return (
    <>
      <div style={styles.toolbar}>
        <input
          placeholder="Suche: Username oder User-ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
        <button className="btn" style={styles.btn} onClick={load}>Aktualisieren</button>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>User ID</th>
              <th>Erstellt</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {state === "loading" && <tr><td colSpan="4" style={styles.muted}>Lade…</td></tr>}
            {state === "error" && <tr><td colSpan="4" style={styles.muted}>Fehler beim Laden.</td></tr>}
            {state === "ok" && filtered.length === 0 && <tr><td colSpan="4" style={styles.muted}>Keine Einträge.</td></tr>}
            {state === "ok" && filtered.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td style={styles.code}>{u.id}</td>
                <td>{new Date(u.created_at).toLocaleString()}</td>
                <td style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button className="btn" style={styles.btnWarnSm} onClick={() => hideScores(u)}>Scores ausblenden</button>
                  <button className="btn" style={styles.btnGhost} onClick={() => anonScores(u)}>Scores anonymisieren</button>
                  <button className="btn" style={styles.btnDangerSm} onClick={() => deleteUser(u)}>User löschen</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* -------------------- Questions Tab -------------------- */
function QuestionsAdmin() {
  const emptyForm = { id: null, question: "", answers: ["","","",""], correct_index: 0, visible: true };
  const [state, setState] = useState("idle");
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [onlyVisible, setOnlyVisible] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);

  const load = async () => {
    setState("loading");
    const { data, error } = await listQuestions({ onlyVisible, search, limit: 5000 });
    if (error) { setRows([]); setState("error"); }
    else { setRows(data || []); setState("ok"); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [onlyVisible]);

  const startEdit = (q) => {
    setEditing(true);
    setForm({
      id: q.id,
      question: q.question,
      answers: [...(q.answers || ["","","",""])],
      correct_index: q.correct_index ?? 0,
      visible: !!q.visible,
    });
  };
  const resetForm = () => { setEditing(false); setForm(emptyForm); };

  const onChangeAnswer = (i, v) => {
    const next = [...form.answers];
    next[i] = v;
    setForm({ ...form, answers: next });
  };
  const addAnswer = () => setForm({ ...form, answers: [...form.answers, ""] });
  const removeAnswer = (i) => setForm({ ...form, answers: form.answers.filter((_, idx) => idx !== i) });

  const save = async () => {
    if (!form.question.trim()) { alert("Frage darf nicht leer sein."); return; }
    const answers = form.answers.map(a => a.trim()).filter(a => a.length);
    if (answers.length < 2) { alert("Mindestens 2 Antworten benötigt."); return; }
    let ci = form.correct_index;
    if (ci < 0 || ci >= answers.length) ci = 0;

    if (editing) {
      const { error } = await updateQuestion(form.id, {
        question: form.question.trim(),
        answers,
        correct_index: ci,
        visible: form.visible,
      });
      if (error) { alert("Update fehlgeschlagen."); return; }
    } else {
      const { error } = await createQuestion({
        question: form.question.trim(),
        answers,
        correct_index: ci,
        visible: form.visible,
      });
      if (error) { alert("Anlegen fehlgeschlagen."); return; }
    }
    resetForm(); await load();
  };

  const del = async (q) => {
    if (!confirm("Frage wirklich LÖSCHEN?")) return;
    await deleteQuestion(q.id); await load();
  };

  const toggleVisible = async (q) => {
    await setQuestionVisible(q.id, !q.visible); await load();
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = `quiz_questions_${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
  };

  const importJSON = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json,application/json";
    input.onchange = async () => {
      const file = input.files[0]; if (!file) return;
      const text = await file.text();
      try {
        const arr = JSON.parse(text);
        if (!Array.isArray(arr)) throw new Error("JSON muss ein Array sein.");
        for (const q of arr) {
          if (!q?.question || !Array.isArray(q?.answers) || typeof q?.correct_index !== "number") continue;
          await createQuestion({
            question: String(q.question),
            answers: q.answers.map(String),
            correct_index: Math.max(0, Math.min(q.correct_index, q.answers.length - 1)),
            visible: q.visible !== false,
          });
        }
        await load();
      } catch {
        alert("Import fehlgeschlagen. Prüfe das JSON-Format.");
      }
    };
    input.click();
  };

  return (
    <>
      <div style={styles.toolbar}>
        <input placeholder="Suche in Fragen & Antworten" value={search} onChange={(e) => setSearch(e.target.value)} style={styles.search} />
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={onlyVisible} onChange={(e) => setOnlyVisible(e.target.checked)} />
          Nur sichtbare
        </label>
        <button className="btn" style={styles.btn} onClick={load}>Aktualisieren</button>
        <button className="btn" style={styles.btnGhost} onClick={exportJSON}>Export JSON</button>
        <button className="btn" style={styles.btnOk} onClick={importJSON}>Import JSON</button>
      </div>

      {/* Editor */}
      <div style={styles.editor}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>{editing ? "Frage bearbeiten" : "Neue Frage"}</div>
        <input
          placeholder="Fragetext"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          style={styles.input}
        />
        <div style={{ display: "grid", gap: 8 }}>
          {form.answers.map((a, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, alignItems: "center" }}>
              <input
                placeholder={`Antwort ${i + 1}`}
                value={a}
                onChange={(e) => onChangeAnswer(i, e.target.value)}
                style={styles.input}
              />
              <label style={styles.radioLbl}>
                <input
                  type="radio"
                  checked={form.correct_index === i}
                  onChange={() => setForm({ ...form, correct_index: i })}
                />
                Richtig
              </label>
              <button className="btn" style={styles.btnGhost} onClick={() => removeAnswer(i)} disabled={form.answers.length <= 2}>Entfernen</button>
            </div>
          ))}
          <div>
            <button className="btn" style={styles.btn} onClick={addAnswer}>Antwort hinzufügen</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} />
            Sichtbar
          </label>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {editing && <button className="btn" style={styles.btnGhost} onClick={resetForm}>Abbrechen</button>}
            <button className="btn" style={styles.btnOk} onClick={save}>{editing ? "Speichern" : "Anlegen"}</button>
          </div>
        </div>
      </div>

      {/* Liste */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Frage</th>
              <th>Antworten</th>
              <th>Richtig</th>
              <th>Sichtbar</th>
              <th>Datum</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {state === "loading" && <tr><td colSpan="6" style={styles.muted}>Lade…</td></tr>}
            {state === "error" && <tr><td colSpan="6" style={styles.muted}>Fehler beim Laden.</td></tr>}
            {state === "ok" && rows.filter(r => {
              const s = search.trim().toLowerCase();
              if (!s) return true;
              return (r.question || "").toLowerCase().includes(s) ||
                     JSON.stringify(r.answers || []).toLowerCase().includes(s);
            }).map(q => (
              <tr key={q.id}>
                <td style={{ maxWidth: 340 }}>{q.question}</td>
                <td style={{ maxWidth: 360, whiteSpace: "pre-wrap" }}>
                  <ol style={{ margin: 0, paddingLeft: 18 }}>
                    {(q.answers || []).map((a, i) => (
                      <li key={i} style={{ opacity: i === q.correct_index ? 1 : 0.85 }}>
                        {a}{i === q.correct_index ? " ✅" : ""}
                      </li>
                    ))}
                  </ol>
                </td>
                <td style={{ textAlign: "center", fontWeight: 800 }}>{q.correct_index + 1}</td>
                <td>{q.visible ? "ja" : "nein"}</td>
                <td>{new Date(q.created_at).toLocaleString()}</td>
                <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button className="btn" style={styles.btnGhost} onClick={() => startEdit(q)}>Bearbeiten</button>
                  {q.visible ? (
                    <button className="btn" style={styles.btnWarnSm} onClick={() => toggleVisible(q)}>Ausblenden</button>
                  ) : (
                    <button className="btn" style={styles.btnOkSm} onClick={() => toggleVisible(q)}>Einblenden</button>
                  )}
                  <button className="btn" style={styles.btnDangerSm} onClick={() => del(q)}>Löschen</button>
                </td>
              </tr>
            ))}
            {state === "ok" && rows.length === 0 && <tr><td colSpan="6" style={styles.muted}>Keine Fragen vorhanden.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* -------------------- Styles -------------------- */
const styles = {
  wrap: {
    width: "min(1100px, calc(100vw - 32px))",
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 16,
    color: "#e5e7eb",
    display: "grid",
    gap: 12,
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  tabBtn: {
    background: "transparent", border: "2px solid #334155", color: "#cbd5e1",
    borderRadius: 12, padding: "8px 12px", cursor: "pointer", fontWeight: 800,
  },
  tabBtnActive: { background: "#2563eb", borderColor: "#2563eb", color: "#fff" },

  btn: { background: "#2563eb", borderRadius: 12, border: "none", color: "#fff", padding: "10px 12px", cursor: "pointer", fontWeight: 800 },
  btnOk: { background: "#16a34a", borderRadius: 12, border: "none", color: "#fff", padding: "10px 12px", cursor: "pointer", fontWeight: 800 },
  btnWarn: { background: "#b45309", borderRadius: 12, border: "none", color: "#fff", padding: "10px 12px", cursor: "pointer", fontWeight: 800 },
  btnDanger: { background: "#b91c1c", borderRadius: 12, border: "none", color: "#fff", padding: "10px 12px", cursor: "pointer", fontWeight: 800 },
  btnGhost: { background: "transparent", borderRadius: 12, border: "2px solid #1f2937", color: "#e5e7eb", padding: "10px 12px", cursor: "pointer", fontWeight: 800 },

  btnOkSm: { background: "#16a34a", borderRadius: 10, border: "none", color: "#fff", padding: "6px 10px", cursor: "pointer", fontWeight: 800 },
  btnWarnSm: { background: "#b45309", borderRadius: 10, border: "none", color: "#fff", padding: "6px 10px", cursor: "pointer", fontWeight: 800 },
  btnDangerSm: { background: "#b91c1c", borderRadius: 10, border: "none", color: "#fff", padding: "6px 10px", cursor: "pointer", fontWeight: 800 },

  toolbar: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  select: { background: "#0b1220", border: "2px solid #1f2937", color: "#e5e7eb", padding: "10px 12px", borderRadius: 10, minWidth: 180 },
  search: { background: "#0b1220", border: "2px solid #1f2937", color: "#e5e7eb", padding: "10px 12px", borderRadius: 10, minWidth: 260, flex: 1 },

  bulkBar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "8px 12px", border: "2px solid #1f2937", borderRadius: 12, background: "#0b1220",
  },

  tableWrap: { overflowX: "auto", borderRadius: 12, border: "2px solid #1f2937" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  sortable: { cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" },
  thNarrow: { width: 32 },
  code: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12 },
  muted: { textAlign: "center", color: "#cbd5e1", padding: 12 },

  pagination: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 },

  editor: { border: "2px solid #1f2937", borderRadius: 12, background: "#0b1220", padding: 12, display: "grid", gap: 10 },
  input: { background: "#0b1220", border: "2px solid #1f2937", color: "#e5e7eb", padding: "10px 12px", borderRadius: 10, width: "100%" },
  radioLbl: { display: "flex", alignItems: "center", gap: 6 },

  note: { fontSize: 12, color: "#cbd5e1", opacity: 0.9 },
};