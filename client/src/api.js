// Falls back to the Vite dev proxy when VITE_API_URL is unset.
export const API = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
// Uploaded files are served from the server root, not under /api.
export const SERVER_URL = API.replace(/\/api$/, "");

// Admin writes need the session cookie; an expired session sends the admin back to login.
export async function adminFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, { ...options, credentials: "include" });
  if (res.status === 401) {
    window.location.assign("/admin");
    throw new Error("Sesi habis, silakan login lagi");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.msg || `Request gagal (${res.status})`);
  }
  return res;
}
