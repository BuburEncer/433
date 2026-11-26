import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { API } from "../../api";
import "./Stats.css";

const COLUMNS = [
  ["played", "Main", "Main"],
  ["win", "M", "Menang"],
  ["draw", "S", "Seri"],
  ["loss", "K", "Kalah"],
  ["points", "Pts", "Poin"],
];

export default function Stats() {
  const [table, setTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/standings`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat klasemen");
        return res.json();
      })
      .then((data) => setTable(Array.isArray(data) ? data.filter((row) => row.Team) : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  let content;
  if (loading) content = <p className="status">Memuat klasemen…</p>;
  else if (error) content = <p className="status status-error">{error}</p>;
  else if (table.length === 0) content = <p className="status">Klasemen belum tersedia.</p>;
  else
    content = (
      // Focusable so keyboard users can scroll the table sideways on phones.
      <div className="table-scroll card" tabIndex={0} role="region" aria-label="Tabel klasemen">
        <table className="standings">
          <thead>
            <tr>
              <th>#</th>
              <th className="col-team">Tim</th>
              {COLUMNS.map(([key, label, full]) => (
                <th key={key} scope="col">
                  <abbr title={full}>{label}</abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) => (
              <tr key={row.Team.id}>
                <td>{i + 1}</td>
                <td className="col-team">
                  <span className="team-cell">
                    <img src={row.Team.logo_url} alt="" />
                    {row.Team.name}
                  </span>
                </td>
                {COLUMNS.map(([key]) => (
                  <td key={key} className={key === "points" ? "col-points" : undefined}>
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="page page-narrow">
        <h1 className="page-title">Klasemen</h1>
        {content}
        <p className="legend">M = menang, S = seri, K = kalah</p>
      </div>
    </>
  );
}
