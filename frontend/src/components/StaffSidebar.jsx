import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  LogOut,
} from 'lucide-react';

const itemClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? 'bg-white/10 text-gold-400'
      : 'text-white/75 hover:bg-white/5 hover:text-white'
  }`;

export default function StaffSidebar({ onNavigate, onLogout }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="font-display text-xl text-white">
          Stay<span className="text-gold-500">Ease</span>
        </p>
        <p className="mt-1 text-xs tracking-wider text-white/50 uppercase">
          Staff panel
        </p>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        <NavLink to="/staff" end className={itemClass} onClick={onNavigate}>
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </NavLink>
        <NavLink to="/staff/rooms" className={itemClass} onClick={onNavigate}>
          <BedDouble className="h-4 w-4" />
          Room management
        </NavLink>
        <NavLink to="/staff/bookings" className={itemClass} onClick={onNavigate}>
          <CalendarCheck className="h-4 w-4" />
          Bookings
        </NavLink>
      </nav>
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
