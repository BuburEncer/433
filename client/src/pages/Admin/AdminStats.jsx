import { useEffect, useState } from "react";
import Select from "react-select";
import Navbar from "../../components/Navbar";
import { API, adminFetch } from "../../api";

export default function AdminStats() {
  const [stats, setStats] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    teamId: "",
    played: "",
    win: "",
    draw: "",
    loss: "",
    points: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    played: "",
    win: "",
    draw: "",
    loss: "",
    points: "",
  });

  const fetchStats = async () => {
    const res = await fetch(`${API}/standings`);
    const data = await res.json();
    setStats(data);
  };

  const fetchTeams = async () => {
    const res = await fetch(`${API}/teams`);
    const data = await res.json();
    setTeams(data);
  };

  useEffect(() => {
    fetchStats();
    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminFetch("/standings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch (err) {
      alert(err.message);
      return;
    }
    fetchStats();
    setForm({
      teamId: "",
      played: "",
      win: "",
      draw: "",
      loss: "",
      points: "",
    });
  };

  const deleteStat = async (id) => {
    try {
      await adminFetch(`/standings/${id}`, { method: "DELETE" });
    } catch (err) {
      alert(err.message);
    }
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar admin />
      <main className="container mx-auto p-5">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Admin - Statistik Tim
        </h2>

        {/* Form Input Stats */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 mb-10 p-6 bg-surface border border-border rounded-card"
        >
          <div>
            <label className="block text-sm font-medium text-muted">
              Nama Tim
            </label>
            <Select
              options={teams.map((team) => ({
                value: team.id,
                label: team.name,
              }))}
              value={
                form.teamId
                  ? {
                      value: form.teamId,
                      label:
                        teams.find((t) => t.id === parseInt(form.teamId))
                          ?.name || "",
                    }
                  : null
              }
              onChange={(option) =>
                setForm({ ...form, teamId: option?.value || "" })
              }
              placeholder="Pilih Tim"
              className="mt-2"
            />
          </div>

          {/* Inputan angka */}
          {[
            { name: "played", label: "Jumlah Pertandingan" },
            { name: "win", label: "Jumlah Menang" },
            { name: "draw", label: "Jumlah Seri" },
            { name: "loss", label: "Jumlah Kalah" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-muted">
                {label}
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={form[name]}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm({
                    ...form,
                    [name]: value === "" ? "" : Math.max("", Number(value)),
                  });
                }}
                required
                className="mt-2 w-full px-4 py-2 border border-input-border rounded-control"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 bg-navy text-white font-semibold rounded-control hover:bg-navy/90"
          >
            Tambah Statistik
          </button>
        </form>

        {/* Daftar Statistik */}
        <div>
          {stats.length > 0 ? (
            <ul className="space-y-6">
              {stats.map((s) => {
                const team = s.Team || s.team;
                if (!team) return null;
                return (
                  <li
                    key={s.id}
                    className="bg-surface border border-border p-5 rounded-card flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-xl font-semibold">{team.name}</h4>
                      <p className="text-muted">
                        Pertandingan: {s.played} | Menang: {s.win} | Seri:{" "}
                        {s.draw} | Kalah: {s.loss} | Poin: {s.points}
                      </p>
                    </div>
                    <div className="space-x-3 flex">
                      <button
                        onClick={() => {
                          setEditingId(s.id);
                          setEditForm({
                            played: s.played,
                            win: s.win,
                            draw: s.draw,
                            loss: s.loss,
                            points: s.points,
                          });
                        }}
                        className="border border-link text-link bg-surface hover:bg-bg px-4 py-2 rounded-control"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteStat(s.id)}
                        className="bg-danger text-white px-4 py-2 rounded-control hover:bg-danger/90"
                      >
                        Hapus
                      </button>
                    </div>
                    {editingId === s.id && (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          try {
                            await adminFetch(`/standings/${s.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                played: Number(editForm.played),
                                win: Number(editForm.win),
                                draw: Number(editForm.draw),
                                loss: Number(editForm.loss),
                              }),
                            });
                          } catch (err) {
                            alert(err.message);
                            return;
                          }
                          setEditingId(null);
                          fetchStats();
                        }}
                        className="space-y-4 mt-4 w-full"
                      >
                        <div>
                          <label className="block text-sm font-medium text-muted">
                            Pertandingan
                          </label>
                          <input
                            type="number"
                            value={editForm.played}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                played: e.target.value,
                              })
                            }
                            min={0}
                            required
                            className="w-full px-4 py-2 border border-input-border rounded-control"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-muted">
                            Menang
                          </label>
                          <input
                            type="number"
                            value={editForm.win}
                            onChange={(e) =>
                              setEditForm({ ...editForm, win: e.target.value })
                            }
                            min={0}
                            required
                            className="w-full px-4 py-2 border border-input-border rounded-control"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-muted">
                            Seri
                          </label>
                          <input
                            type="number"
                            value={editForm.draw}
                            onChange={(e) =>
                              setEditForm({ ...editForm, draw: e.target.value })
                            }
                            min={0}
                            required
                            className="w-full px-4 py-2 border border-input-border rounded-control"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-muted">
                            Kalah
                          </label>
                          <input
                            type="number"
                            value={editForm.loss}
                            onChange={(e) =>
                              setEditForm({ ...editForm, loss: e.target.value })
                            }
                            min={0}
                            required
                            className="w-full px-4 py-2 border border-input-border rounded-control"
                          />
                        </div>

                        <div className="flex space-x-3">
                          <button
                            type="submit"
                            className="bg-navy text-white px-4 py-2 rounded-control hover:bg-navy/90"
                          >
                            Simpan
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="text-muted px-4 py-2 rounded-control hover:bg-bg hover:text-text"
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-center text-muted">
              Belum ada data statistik.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
