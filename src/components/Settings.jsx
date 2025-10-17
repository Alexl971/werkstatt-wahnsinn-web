import React, { useMemo, useState } from "react";

export default function Settings({ settings, setSettings, onBack, onQuickStart }) {
  const [view, setView] = useState("root");

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Einstellungen</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={onQuickStart ? styles.btnPrimary : styles.btnSecondary}
              onClick={onQuickStart || onBack}
            >
              {onQuickStart ? "Start" : "Zurück"}
            </button>
          </div>
        </div>

        {/* Hauptmenü */}
        {view === "root" && (
          <div style={styles.section}>
            <ListButton label="Spiele auswählen" onClick={() => setView("games")} />
            <Row>
              <span style={styles.rowLabel}>Sound</span>
              <Switch
                checked={!!settings.soundEnabled}
                onChange={(v) => setSettings({ ...settings, soundEnabled: v })}
              />
            </Row>
            <InfoBox>🕒 <b>Rundenlänge:</b> 20 Sekunden (fix)</InfoBox>

            <div style={styles.centerBtn}>
              <button style={styles.btnGhost} onClick={onBack}>Fertig</button>
            </div>
          </div>
        )}

        {/* Spiele-Auswahl */}
        {view === "games" && (
          <GamesView
            values={settings.enabledGames}
            onChange={(next) => setSettings({ ...settings, enabledGames: next })}
            onBack={() => setView("root")}
          />
        )}
      </div>
    </div>
  );
}

function GamesView({ values, onChange, onBack }) {
  const entries = useMemo(() => [
    ["TAP_FRENZY", "Ölwechsel 3000 (Tap)"],
    ["QUIZ", "Werkstatt-Quiz"],
    ["SWIPE_APPROVAL", "Garantiehölle (Swipe)"],
    ["SORT_SEQUENCE", "Rechnungs-Sortierer"],
    ["BRAKE_TEST", "Bremsentest"],
    ["CODE_TYPER", "Code-Tipper"],
  ], []);

  const toggle = (key) => onChange({ ...values, [key]: !values[key] });

  return (
    <div style={styles.section}>
      <div style={styles.subHeader}>
        <button style={styles.backBtn} onClick={onBack}>‹ Zurück</button>
        <h3 style={styles.subTitle}>Spiele auswählen</h3>
        <div style={{ width: 88 }} />
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {entries.map(([k, label]) => (
          <Row key={k}>
            <span style={styles.rowLabel}>{label}</span>
            <Switch checked={!!values[k]} onChange={() => toggle(k)} />
          </Row>
        ))}
      </div>
    </div>
  );
}

/* ========== Bausteine ========== */
function ListButton({ label, onClick }) {
  return (
    <button onClick={onClick} style={styles.listBtn}>
      <span>{label}</span>
      <span style={styles.chev}>›</span>
    </button>
  );
}

function Row({ children }) {
  return <div style={styles.row}>{children}</div>;
}

function Switch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      style={{
        width: 48,
        height: 28,
        borderRadius: 999,
        border: "2px solid " + (checked ? "#22c55e" : "#334155"),
        background: checked ? "linear-gradient(180deg,#22c55e,#16a34a)" : "#0b1220",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 26 : 2,
          width: 20,
          height: 20,
          borderRadius: 999,
          background: "#e5e7eb",
          transition: "left .15s ease",
        }}
      />
    </button>
  );
}

function InfoBox({ children }) {
  return <div style={styles.infoBox}>{children}</div>;
}

/* ========== Styles ========== */
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 16,
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { margin: 0, fontSize: 24, fontWeight: 800 },
  section: { display: "grid", gap: 10 },
  subHeader: {
    display: "grid",
    gridTemplateColumns: "88px 1fr 88px",
    alignItems: "center",
    marginBottom: 6,
  },
  subTitle: { textAlign: "center", margin: 0, fontSize: 18, fontWeight: 800 },
  backBtn: {
    background: "#334155",
    borderRadius: 10,
    border: "none",
    color: "#e5e7eb",
    padding: "8px 10px",
    cursor: "pointer",
    fontWeight: 700,
  },
  listBtn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: "2px solid #1f2937",
    background: "#0b1220",
    color: "#e5e7eb",
    cursor: "pointer",
    fontWeight: 700,
  },
  chev: { fontSize: 18, opacity: 0.9 },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 14,
    border: "2px solid #1f2937",
    background: "#0b1220",
  },
  rowLabel: { fontWeight: 600 },
  infoBox: {
    background: "#0b1220",
    border: "2px solid #1f2937",
    borderRadius: 12,
    padding: "10px 12px",
    color: "#cbd5e1",
    fontSize: 14,
  },
  centerBtn: { marginTop: 10, textAlign: "center" },
  btnPrimary: {
    background: "#2563eb",
    borderRadius: 12,
    border: "none",
    color: "white",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 800,
  },
  btnSecondary: {
    background: "#334155",
    borderRadius: 12,
    border: "none",
    color: "#e5e7eb",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 800,
  },
  btnGhost: {
    background: "#0b1220",
    borderRadius: 12,
    border: "2px solid #1f2937",
    color: "#e5e7eb",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 800,
  },
};