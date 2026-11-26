import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { adminFetch } from "../api";
import "./Navbar.css";

const PUBLIC_LINKS = [
  ["/", "Home"],
  ["/matches", "Matches"],
  ["/news", "Berita"],
  ["/stats", "Statistik"],
];

const ADMIN_LINKS = [
  ["/admin/dashboard", "Dashboard Admin"],
  ["/admin/matches", "Admin Matches"],
  ["/admin/news", "Admin News"],
  ["/admin/stats", "Admin Stats"],
];

export default function Navbar({ admin = false }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    setOpen(false);
    try {
      await adminFetch("/admin/logout", { method: "DELETE" });
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbarInner">
        <div className="navbarLogo">
          <img src="/logo.svg" alt="" className="logoImage" />
          <div className="navbarText">4231</div>
        </div>

        <button
          type="button"
          className="hamburger"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls="navbar-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>

        <ul id="navbar-menu" className={open ? "navbarMenu open" : "navbarMenu"}>
          {(admin ? ADMIN_LINKS : PUBLIC_LINKS).map(([to, label]) => (
            <li key={label}>
              <NavLink to={to} end className="navbarLink" onClick={() => setOpen(false)}>
                {label}
              </NavLink>
            </li>
          ))}
          {admin && (
            <li>
              <button type="button" className="navbarLink navbarButton" onClick={logout}>
                Exit Admin
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
