import React, { useState } from "react";

export default function Settings({ settings, setSettings, onBack }) {
  const [view, setView] = useState("MAIN"); // MAIN | GAMES | ROUND

  const setGame = (key, value) =>
    setSettings({
      ...settings,
      enabledGames: { ...settings.enabledGames, [key]: value },
    });

  const RowButton = ({ title, right }) => (
    <button
      className="card"
      onClick={() => setView(title === "Spiele auswählen" ? "GAMES" : "ROUND")}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 12px",
        width: "100%",
        background: "#111827",
        border: "2px solid #1f2937",
        borderRadius: 12,
        color: "#e5e7eb",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span>{title}</span>
      <span style={{ color: "#cbd5e1" }}>{right} ›</span>
    </button>
  );

  const BackHeader = ({ title }) => (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
      <button className="btn" style={btnSecondary} onClick={() => setView("MAIN")}>
        Zurück
      </button>
      <h2 style={{ margin: 0, flex: 1, textAlign: "center" }}>{title}</h2>
      <button className="btn" style={btnSecondary} onClick={onBack}>
        Start
      </button>
    </div>
  );

  if (view === "GAMES") {
    return (
      <div className="card" style={card}>
        <BackHeader title="Spiele aktivieren" />
        <Toggle label="Ölwechsel 3000 (Tap)" value={settings.enabledGames.TAP_FRENZY} onChange={(v) => setGame("TAP_FRENZY", v)} />
        <Toggle label="Quiz" value={settings.enabledGames.QUIZ} onChange={(v) => setGame("QUIZ", v)} />
        <Toggle label="Garantie-Hölle (Swipe/Buttons)" value={settings.enabledGames.SWIPE_APPROVAL} onChange={(v) => setGame("SWIPE_APPROVAL", v)} />
        <Toggle label="Rechnung sortieren (Drag & Drop)" value={settings.enabledGames.SORT_SEQUENCE} onChange={(v) => setGame("SORT_SEQUENCE", v)} />
        <Toggle label="Bremsentest" value={settings.enabledGames.BRAKE_TEST} onChange={(v) => setGame("BRAKE_TEST", v)} />
        <Toggle label="Fehlercode-Tapper" value={settings.enabledGames.CODE_TYPER} onChange={(v) => setGame("CODE_TYPER", v)} />
      </div>
    );
  }

  if (view === "ROUND") {
    return (
      <div className="card" style={card}>
        <BackHeader title="Rundenlänge" />
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {[15, 20, 30].map((sec) => (
            <button
              key={sec}
              className={"pill" + (settings.roundSeconds === sec ? " active" : "")}
              onClick={() => setSettings({ ...settings, roundSeconds: sec })}
            >
              {sec}s
            </button>
          ))}
        </div>
        <div style={{ marginTop: 8, color: "#cbd5e1", textAlign: "center" }}>
          Aktuell: {settings.roundSeconds}s
        </div>
      </div>
    );
  }

  // MAIN
  return (
    <div className="card" style={card}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <div />
        <h2 style={{ margin: 0, flex: 1, textAlign: "center" }}>Einstellungen</h2>
        <button className="btn" style={btnSecondary} onClick={onBack}>
          Start
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <RowButton title="Spiele auswählen" right="" />
        <RowButton title="Rundenlänge" right={`${settings.roundSeconds}s`} />
        <Toggle
          label="Sound"
          value={settings.soundEnabled}
          onChange={(v) => setSettings({ ...settings, soundEnabled: v })}
        />
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div
      className="card"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 12px",
        width: "100%",
        background: "#111827",
        border: "2px solid #1f2937",
        borderRadius: 12,
        color: "#e5e7eb",
      }}
    >
      <span>{label}</span>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
    </div>
  );
}

const card = {
  width: "100%",
  maxWidth: 560,
  background: "#111827",
  border: "2px solid #1f2937",
  borderRadius: 18,
  padding: 16,
};

const btnSecondary = {
  background: "#334155",
  borderRadius: 12,
  border: "none",
  color: "#e5e7eb",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 700,
};