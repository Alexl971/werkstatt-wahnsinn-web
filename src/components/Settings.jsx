import React, { useState } from "react";

export default function Settings({ settings, setSettings, onBack }) {
  const [localSettings, setLocalSettings] = useState(settings);

  const toggleGame = (key) => {
    setLocalSettings((prev) => ({
      ...prev,
      enabledGames: {
        ...prev.enabledGames,
        [key]: !prev.enabledGames[key],
      },
    }));
  };

  const toggleSound = () => {
    setLocalSettings((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  const saveAndBack = () => {
    setSettings(localSettings);
    onBack();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>⚙️ Einstellungen</h2>
        <button style={styles.saveBtn} onClick={saveAndBack}>
          Speichern
        </button>
      </div>

      {/* Spieleauswahl */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Spiele auswählen</div>
        <div style={styles.gamesGrid}>
          {Object.entries(localSettings.enabledGames).map(([key, value]) => (
            <label key={key} style={styles.gameOption}>
              <input
                type="checkbox"
                checked={value}
                onChange={() => toggleGame(key)}
                style={styles.checkbox}
              />
              <span>{getGameLabel(key)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sound */}
      <div style={styles.section}>
        <label style={styles.soundLabel}>
          <input
            type="checkbox"
            checked={localSettings.soundEnabled}
            onChange={toggleSound}
            style={styles.checkbox}
          />
          <span>Sound aktivieren</span>
        </label>
      </div>

      {/* Zurück */}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button style={styles.backBtn} onClick={onBack}>
          Zurück
        </button>
      </div>
    </div>
  );
}

function getGameLabel(key) {
  const names = {
    TAP_FRENZY: "Ölwechsel 3000",
    QUIZ: "Werkstatt-Quiz",
    SWIPE_APPROVAL: "Garantiehölle",
    SORT_SEQUENCE: "Rechnungs-Sortierer",
    BRAKE_TEST: "Bremsentest",
    CODE_TYPER: "Code-Tipper",
  };
  return names[key] || key;
}

const styles = {
  container: {
    width: "100%",
    maxWidth: 480,
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 18,
    padding: 20,
    color: "#e5e7eb",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    margin: 0,
    fontSize: 22,
  },
  saveBtn: {
    background: "#2563eb",
    border: "none",
    color: "white",
    padding: "8px 14px",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontWeight: 700,
    marginBottom: 8,
    color: "#93c5fd",
  },
  gamesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 8,
  },
  gameOption: {
    background: "#0b1220",
    border: "2px solid #1f2937",
    borderRadius: 10,
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },
  checkbox: {
    width: 18,
    height: 18,
  },
  soundLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#0b1220",
    border: "2px solid #1f2937",
    borderRadius: 10,
    padding: "10px 12px",
    cursor: "pointer",
  },
  backBtn: {
    background: "#334155",
    borderRadius: 10,
    border: "none",
    color: "#e5e7eb",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
};