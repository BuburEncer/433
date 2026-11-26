import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import NewsList from "../../components/NewsList";
import { API } from "../../api";
import "./Home.css";

const SHORTCUTS = [
  ["/news", "Berita", "Kabar terbaru seputar Liga Champions."],
  ["/matches", "Jadwal & Hasil", "Pertandingan yang akan datang dan skor akhir."],
  ["/stats", "Klasemen", "Menang, seri, kalah, dan poin setiap tim."],
];

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/news`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat berita");
        return res.json();
      })
      .then((data) => setNews(data.slice(0, 6)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-inner">
          <h1>Liga Champions dalam satu tempat</h1>
          <p>Berita, jadwal pertandingan, dan klasemen terbaru.</p>
          <Link to="/matches" className="button-accent">
            Lihat jadwal
          </Link>
        </div>
      </section>

      <div className="page">
        <nav className="shortcuts" aria-label="Pintasan">
          {SHORTCUTS.map(([to, title, text]) => (
            <Link key={to} to={to} className="shortcut card">
              <strong>{title}</strong>
              <span>{text}</span>
            </Link>
          ))}
        </nav>

        <h2 className="page-title">Berita terbaru</h2>
        {loading ? (
          <p className="status">Memuat berita…</p>
        ) : error ? (
          <p className="status status-error">{error}</p>
        ) : (
          <NewsList items={news} headingLevel={3} />
        )}
      </div>
    </>
  );
}
