import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { API, SERVER_URL, adminFetch } from "../../api";

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({
    title: "",
    caption: "",
    image: null,
  });


  const fetchNews = async () => {
    const res = await fetch(`${API}/news`);
    const data = await res.json();
    setNews(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("caption", form.caption);
    formData.append("image", form.image);

    try {
      await adminFetch("/news", { method: "POST", body: formData });
    } catch (err) {
      alert(err.message);
      return;
    }

    setForm({ title: "", caption: "", image: null });
    e.target.reset();
    fetchNews();
  };

  const deleteNews = async (id) => {
    try {
      await adminFetch(`/news/${id}`, { method: "DELETE" });
    } catch (err) {
      alert(err.message);
    }
    fetchNews();
  };

  return (
    <div className="bg-bg min-h-screen">
      <Navbar admin />
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-semibold mb-6">Kelola Berita</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border p-6 rounded-card space-y-4"
        >
          <input
            type="text"
            placeholder="Judul berita"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full p-3 border border-input-border rounded-control"
          />
          <textarea
            placeholder="Caption berita..."
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
            rows={5}
            required
            className="w-full p-3 border border-input-border rounded-control"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            required
            className="w-full p-3 border border-input-border rounded-control"
          />
          <button
            type="submit"
            className="w-full bg-link text-white p-3 rounded-control hover:bg-link/90"
          >
            Tambah Berita
          </button>
        </form>

        <hr className="my-8" />

        <ul className="space-y-8">
          {news.map((n) => (
            <li
              key={n.id}
              className="bg-surface border border-border p-6 rounded-card space-y-4"
            >
              {n.image_url && (
                <img
                  src={`${SERVER_URL}${n.image_url}`}
                  alt={n.title}
                  className="w-full h-48 object-cover rounded-control"
                />
              )}
              <h3 className="text-xl font-semibold">{n.title}</h3>
              <p className="text-muted">{n.caption}</p>{" "}
              {/* Caption tampilkan */}
              <button
                onClick={() => deleteNews(n.id)}
                className="mt-4 bg-danger text-white px-4 py-2 rounded-control hover:bg-danger/90"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
