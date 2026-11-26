import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar admin />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold text-text">
          Admin Dashboard
        </h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-surface border border-border p-6 rounded-card hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-text">
              Manage Matches
            </h3>
            <p className="mt-2 text-muted">View and edit match details.</p>
            <Link
              to="/admin/matches"
              className="mt-4 inline-block text-link hover:underline"
            >
              Go to Matches
            </Link>
          </div>
          <div className="bg-surface border border-border p-6 rounded-card hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-text">Manage News</h3>
            <p className="mt-2 text-muted">
              Update and manage news articles.
            </p>
            <Link
              to="/admin/news"
              className="mt-4 inline-block text-link hover:underline"
            >
              Go to News
            </Link>
          </div>
          <div className="bg-surface border border-border p-6 rounded-card hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-text">
              Manage Stats
            </h3>
            <p className="mt-2 text-muted">Analyze and update statistics.</p>
            <Link
              to="/admin/stats"
              className="mt-4 inline-block text-link hover:underline"
            >
              Go to Stats
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
