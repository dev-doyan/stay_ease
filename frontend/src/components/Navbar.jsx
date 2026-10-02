import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ variant = 'solid' }) {
  const { user, isStaff, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const transparent = variant === 'transparent';

  const navShell = transparent
    ? 'absolute inset-x-0 top-0 z-40'
    : 'sticky top-0 z-40 border-b border-cream-100 bg-white/95 backdrop-blur-md';

  const linkClass = ({ isActive }) => {
    if (transparent) {
      return `text-sm font-medium transition ${
        isActive ? 'text-gold-500' : 'text-white/85 hover:text-white'
      }`;
    }
    return `text-sm font-medium transition ${
      isActive ? 'text-gold-500' : 'text-charcoal/80 hover:text-navy-900'
    }`;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setOpen(false);
  };

  const guestLinks = (
    <>
      <NavLink to="/" className={linkClass} end onClick={() => setOpen(false)}>
        Home
      </NavLink>
      <NavLink to="/rooms" className={linkClass} onClick={() => setOpen(false)}>
        Rooms
      </NavLink>
      <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>
        Dashboard
      </NavLink>
      <NavLink to="/bookings" className={linkClass} onClick={() => setOpen(false)}>
        My Bookings
      </NavLink>
    </>
  );

  const staffLinks = (
    <>
      <NavLink to="/staff" className={linkClass} end onClick={() => setOpen(false)}>
        Dashboard
      </NavLink>
      <NavLink to="/staff/rooms" className={linkClass} onClick={() => setOpen(false)}>
        Room Management
      </NavLink>
      <NavLink to="/staff/bookings" className={linkClass} onClick={() => setOpen(false)}>
        Bookings
      </NavLink>
    </>
  );

  const publicLinks = (
    <>
      <NavLink to="/" className={linkClass} end onClick={() => setOpen(false)}>
        Home
      </NavLink>
      <NavLink to="/rooms" className={linkClass} onClick={() => setOpen(false)}>
        Rooms
      </NavLink>
      <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>
        Login
      </NavLink>
      <Link
        to="/register"
        onClick={() => setOpen(false)}
        className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-gold-400"
      >
        Sign Up
      </Link>
    </>
  );

  const brandClass = transparent
    ? 'font-display text-2xl tracking-tight text-white'
    : 'font-display text-2xl tracking-tight text-navy-900';

  const logoutClass = transparent
    ? 'inline-flex items-center gap-1.5 text-sm font-medium text-white/85 transition hover:text-white'
    : 'inline-flex items-center gap-1.5 text-sm font-medium text-charcoal/80 transition hover:text-navy-900';

  const mobileToggle = transparent ? 'text-white' : 'text-navy-900';

  return (
    <header className={navShell}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 lg:px-8">
        <Link to="/" className={brandClass}>
          Stay<span className="text-gold-500">Ease</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {!user && publicLinks}
          {user && !isStaff && guestLinks}
          {user && isStaff && staffLinks}
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className={logoutClass}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>

        <button
          type="button"
          className={`rounded-lg p-2 md:hidden ${mobileToggle}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div
          className={`px-4 py-4 md:hidden ${
            transparent
              ? 'border-t border-white/10 bg-navy-950/95 backdrop-blur-md'
              : 'border-t border-cream-100 bg-white'
          }`}
        >
          <div className="flex flex-col gap-4">
            {!user && publicLinks}
            {user && !isStaff && guestLinks}
            {user && isStaff && staffLinks}
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-left text-sm font-medium text-white/85"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
