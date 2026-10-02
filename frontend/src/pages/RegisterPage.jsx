import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import { ApiError } from '../api/client';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register({ name, email, password });
      navigate(user.role === 'STAFF' ? '/staff' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-cream-100 bg-white p-8 shadow-sm">
        <h1 className="font-display text-3xl text-navy-900">Join StayEase</h1>
        <p className="mt-2 text-sm text-charcoal/60">
          Create a guest account to book rooms. Staff accounts are assigned separately.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm">
            <span className="font-medium">Full name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-navy-800/15 px-3 py-2.5 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-navy-800/15 px-3 py-2.5 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Password</span>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-navy-800/15 px-3 py-2.5 pr-10 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-charcoal/50"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <ErrorMessage message={error} />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold-500 py-3 text-sm font-semibold text-navy-950 transition hover:bg-gold-400 disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-charcoal/60">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-gold-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
