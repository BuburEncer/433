// Falls back to the Vite dev proxy when VITE_API_URL is unset.
export const API = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
// Uploaded files are served from the server root, not under /api.
export const SERVER_URL = API.replace(/\/api$/, "");

