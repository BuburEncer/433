export const API = import.meta.env.VITE_API_URL;
// Uploaded files are served from the server root, not under /api.
export const SERVER_URL = API.replace(/\/api$/, "");
