import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { API } from "../../api";
import "./Matches.css";

// "live" matches have a score but are not over yet, so they sit with the upcoming ones.
const TABS = [
  {
    key: "upcoming",
    label: "Terjadwal",
    statuses: ["live", "scheduled"],
    empty: "Belum ada pertandingan terjadwal.",
  },
  {
    key: "finished",
    label: "Selesai",
    statuses: ["finished"],
    empty: "Belum ada hasil pertandingan.",
  },
];

const formatDate = (d) =>
  new Date(d).toLocaleString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function MatchRow({ m }) {
  const hasScore = m.status !== "scheduled";
  return (
    <li className="match-row">
      <span className="team team-home">
        <span className="team-name">{m.HomeTeam.name}</span>
        <img src={m.HomeTeam.logo_url} alt="" />
      </span>
      <span className="match-center">
        {m.status === "live" && <span className="live-badge">Live</span>}
        <span className={hasScore ? "score" : "vs"}>
          {hasScore ? `${m.home_score ?? 0} - ${m.away_score ?? 0}` : "vs"}
        </span>
        <time dateTime={m.match_date}>{formatDate(m.match_date)}</time>
      </span>
      <span className="team team-away">
        <img src={m.AwayTeam.logo_url} alt="" />
        <span className="team-name">{m.AwayTeam.name}</span>
      </span>
    </li>
  );
}

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("upcoming");

  useEffect(() => {
    fetch(`${API}/matches`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat jadwal");
        return res.json();
      })
      .then(setMatches)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const activeTab = TABS.find((t) => t.key === tab);
  const shown = matches.filter((m) => activeTab.statuses.includes(m.status));

  let content;
  if (loading) content = <p className="status">Memuat jadwal pertandingan…</p>;
  else if (error) content = <p className="status status-error">{error}</p>;
  else if (shown.length === 0) content = <p className="status">{activeTab.empty}</p>;
  else
    content = (
      <ul className="match-list card">
        {shown.map((m) => (
          <MatchRow key={m.id} m={m} />
        ))}
      </ul>
    );

  return (
    <>
      <Navbar />
      <main className="page page-narrow">
        <h1 className="page-title">Jadwal & Hasil</h1>

        <div className="tabs" role="radiogroup" aria-label="Status pertandingan">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="radio"
              aria-checked={tab === t.key}
              className="tab"
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {content}
      </main>
    </>
  );
}
