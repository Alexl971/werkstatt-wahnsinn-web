import React, { useState } from "react";

const GAME_LABELS = {
  TAP_FRENZY: "Ölwechsel 3000",
  QUIZ: "Werkstatt-Quiz",
  SWIPE_APPROVAL: "Garantiehölle",
  SORT_SEQUENCE: "Rechnungs-Sortierer",
  BRAKE_TEST: "Bremsentest",
  CODE_TYPER: "Code-Tipper",
};

export default function Settings({ settings, setSettings, onBack }) {
  const [tab, setTab] = useState("games"); // games | feedback

  const toggleGame = (k) => {
    const next = { ...settings, enabledGames: { ...settings.enabledGames, [k]: !settings.enabledGames[k] } };
    setSettings(next);
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>Einstellungen</h2>
        <button className="btn" style={styles.btnGhost} onClick={onBack}>Zurück</button>
      </div>

      <div style={styles.tabs}>
        <button style={tabBtn(tab === "games")} onClick={() => setTab("games")}>Spiele</button>
        <button style={tabBtn(tab === "feedback")} onClick={() => setTab("feedback")}>Feedback</button>
      </div>

      {tab === "games" && (
        <div className="card" style={styles.card}>
          <div style={styles.sectionTitle}>Aktive Spiele</div>
          <div style={styles.grid}>
            {Object.keys(GAME_LABELS).map((k) => (
              <label key={k} style={styles.row}>
                <input
                  type="checkbox"
                  checked={!!settings.enabledGames[k]}
                  onChange={() => toggleGame(k)}
                />
                <span>{GAME_LABELS[k]}</span>
              </label>
            ))}
          </div>

          <div style={{ marginTop: 12, color: "#cbd5e1" }}>
            Rundenlänge ist fest auf <b>20s</b> eingestellt.
          </div>
        </div>
      )}

      {tab === "feedback" && (
        <div className="card" style={styles.card}>
          <div style={styles.sectionTitle}>Feedback</div>
          <label style={styles.row}>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => setSettings({ ...settings, soundEnabled: e.target.checked })}
            />
            <span>Soundeffekte</span>
          </label>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    width: "min(640px, 100%)",
    margin: "0 auto",
    padding: 16,
    display: "grid",
    gap: 12,
    color: "#e5e7eb",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  tabs: { display: "flex", gap: 8, flexWrap: "wrap" },
  card: { background: "#111827", border: "2px solid #1f2937", borderRadius: 18, padding: 14 },
  grid: { display: "grid", gap: 8 },
  row: { display: "flex", alignItems: "center", gap: 8, background: "#0b1220", border: "2px solid #1f2937", borderRadius: 12, padding: "10px 12px" },
  sectionTitle: { fontWeight: 800, marginBottom: 8 },
  btnGhost: { background: "transparent", borderRadius: 12, border: "2px solid #334155", color: "#e5e7eb", padding: "8px 12px", cursor: "pointer", fontWeight: 800 },
};

function tabBtn(active) {
  return {
    background: active ? "#2563eb" : "transparent",
    border: `2px solid ${active ? "#2563eb" : "#334155"}`,
    color: active ? "#fff" : "#cbd5e1",
    borderRadius: 12,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 800,
  };
}