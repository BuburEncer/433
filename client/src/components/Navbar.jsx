import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
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
  ["/", "Exit Admin"],
];

export default function Navbar({ admin = false }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbarInner">
        <div className="navbarLogo">
          <img src="/4-2-3-1 Logo.png" alt="Logo 4-2-3-1" className="logoImage" />
          <div className="navbarText">4-2-3-1</div>
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
              <Link to={to} className="navbarLink" onClick={() => setOpen(false)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
