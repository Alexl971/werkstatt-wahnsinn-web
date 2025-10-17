// src/components/Settings.jsx
import React, { useMemo, useState } from "react";

/**
 * Props:
 * - settings: { enabledGames: Record<string, boolean>, soundEnabled: boolean }
 * - setSettings: (next) => void
 * - onBack: () => void
 * - onQuickStart?: () => void  // optional: zeigt "Start"-Button oben rechts
 */
export default function Settings({ settings, setSettings, onBack, onQuickStart }) {
  const [view, setView] = useState("root"); // "root" | "games"

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Einstellungen</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {onQuickStart ? (
              <button style={styles.btnPrimary} onClick={onQuickStart}>Start</button>
            ) : (
              <button style={styles.btnSecondary} onClick={onBack}>Zurück</button>
            )}
          </div>
        </div>

        {/* Root-Ansicht */}
        {view === "root" && (
          <div style={styles.section}>
            <ListButton
              label="Spiele auswählen"
              onClick={() => setView("games")}
            />

            <Row>
              <span style={styles.rowLabel}>Sound</span>
              <Switch
                checked={!!settings.soundEnabled}
                onChange={(v) => setSettings({ ...settings, soundEnabled: v })}
              />
            </Row>

            <InfoBox>
              🕒 <b>Rundenlänge:</b> 20 Sekunden (fix)
            </InfoBox>

            <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
              <button style={styles.btnGhost} onClick={onBack}>Fertig</button>
            </div>
          </div>
        )}

        {/* Untermenü: Spiele */}
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

/* ---------- Unteransicht: Spiele ---------- */
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
      <SubHeader title="Spiele auswählen" onBack={onBack} />
      <div style={{ display: "grid", gap: 8 }}>
        {entries.map(([k, label]) => (
          <Row key={k}>
            <span style={styles.rowLabel}>{label}</span>
            <Switch checked={!!values[k]} onChange={() => toggle(k)} />
          </Row>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
        <button style={styles.btnGhost} onClick={onBack}>Zurück</button>
      </div>
    </div>
  );
}

/* ---------- Bausteine ---------- */
function SubHeader({ title, onBack }) {
  return (
    <div style={styles.subHeader}>
      <button style={styles.backBtn} onClick={onBack}>‹ Zurück</button>
      <h3 style={styles.subTitle}>{title}</h3>
      <div style={{ width: 88 }} />
    </div>
  );
}

function ListButton({ label, rightText, onClick }) {
  return (
    <button onClick={onClick} style={styles.listBtn}>
      <span>{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 10, color: "#94a3b8" }}>
        {rightText && <span>{rightText}</span>}
        <span style={styles.chev}>›</span>
      </span>
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
  return (
    <div style={styles.infoBox}>
      {children}
    </div>
  );
}

/* ---------- Styles ---------- */
const styles = {
  wrap: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 560,
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 14,
    color: "#e5e7eb",
  },

  header: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { margin: 0, fontSize: 24 },

  section: { display: "grid", gap: 10 },

  subHeader: {
    display: "grid",
    gridTemplateColumns: "88px 1fr 88px",
    alignItems: "center",
    marginBottom: 6,
  },
  subTitle: { textAlign: "center", margin: 0, fontSize: 18, fontWeight: 800 },
  backBtn: {
    justifySelf: "start",
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
    marginTop: 4,
    background: "#0b1220",
    border: "2px solid #1f2937",
    borderRadius: 12,
    padding: "10px 12px",
    color: "#cbd5e1",
    fontSize: 14,
  },

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