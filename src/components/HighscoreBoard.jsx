import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function HighscoreBoard() {
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);

  const games = [
    "QUIZ",
    "TAP_FRENZY",
    "SWIPE_APPROVAL",
    "SORT_SEQUENCE",
    "BRAKE_TEST",
    "CODE_TYPER",
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = {};
      for (const game of games) {
        const { data } = await supabase
          .from("highscores")
          .select("player_name, score")
          .eq("game_name", game)
          .order("score", { ascending: false })
          .limit(5);
        result[game] = data || [];
      }
      setScores(result);
      setLoading(false);
    }
    load();
  }, []);

  if (loading)
    return <div style={{ textAlign: "center", color: "#94a3b8" }}>Lädt...</div>;

  return (
    <div style={styles.container}>
      {games.map((game) => (
        <div key={game} style={styles.card}>
          <h3 style={styles.title}>{formatName(game)}</h3>
          {scores[game]?.length > 0 ? (
            <table style={styles.table}>
              <tbody>
                {scores[game].map((row, i) => (
                  <tr key={i}>
                    <td style={styles.rank}>{i + 1}.</td>
                    <td style={styles.name}>{row.player_name}</td>
                    <td style={styles.score}>{row.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ color: "#64748b", fontSize: 14 }}>Keine Einträge</div>
          )}
        </div>
      ))}
    </div>
  );
}

function formatName(name) {
  const map = {
    QUIZ: "Werkstatt-Quiz",
    TAP_FRENZY: "Ölwechsel 3000",
    SWIPE_APPROVAL: "Garantiehölle",
    SORT_SEQUENCE: "Rechnungs-Sortierer",
    BRAKE_TEST: "Bremsentest",
    CODE_TYPER: "Code-Tipper",
  };
  return map[name] || name;
}

const styles = {
  container: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    width: "100%",
    maxWidth: 900,
  },
  card: {
    background: "#111827",
    border: "2px solid #1f2937",
    borderRadius: 16,
    padding: 12,
  },
  title: {
    fontSize: 18,
    color: "#f1f5f9",
    marginBottom: 8,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  rank: { color: "#64748b", width: 30 },
  name: { color: "#e2e8f0" },
  score: { color: "#38bdf8", textAlign: "right" },
};