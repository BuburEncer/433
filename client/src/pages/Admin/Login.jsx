import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Email atau password salah');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-navy px-4">
      <form onSubmit={login} className="card w-full max-w-sm p-8 space-y-4">
        <h1 className="text-2xl font-extrabold">Login Admin</h1>
        {error && (
          <p role="alert" className="text-danger">
            {error}
          </p>
        )}
        <label className="block">
          <span className="text-sm font-semibold">Email</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-input-border px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-input-border px-3 py-2"
          />
        </label>
        <button type="submit" className="w-full rounded-lg bg-navy py-3 font-bold text-white hover:bg-navy/90">
          Login
        </button>
      </form>
    </main>
  );
}
