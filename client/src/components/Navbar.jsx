import { Link } from "react-router-dom";
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
  return (
    <nav className="navbar">
      <div className="navbarInner">
        <div className="navbarLogo">
          <img src="/4-2-3-1 Logo.png" alt="Logo 4-2-3-1" className="logoImage" />
          <div className="navbarText">4-2-3-1</div>
        </div>

        <ul className="navbarMenu">
          {(admin ? ADMIN_LINKS : PUBLIC_LINKS).map(([to, label]) => (
            <li key={label}>
              <Link to={to} className="navbarLink">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
