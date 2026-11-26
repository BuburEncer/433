import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import NewsList from "../../components/NewsList";
import { API } from "../../api";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/news`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat berita");
        return res.json();
      })
      .then(setNews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="page">
        <h1 className="page-title">Berita</h1>
        {loading ? (
          <p className="status">Memuat berita…</p>
        ) : error ? (
          <p className="status status-error">{error}</p>
        ) : (
          <NewsList items={news} showCaption />
        )}
      </main>
    </>
  );
}
