import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import StaffSidebar from '../components/StaffSidebar';
import { useAuth } from '../context/AuthContext';

export default function StaffLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream-50 lg:flex">
      <aside className="hidden w-64 shrink-0 bg-navy-950 lg:block">
        <StaffSidebar onNavigate={() => {}} onLogout={handleLogout} />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy-950/60"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative h-full w-64 bg-navy-950 shadow-xl">
            <button
              type="button"
              className="absolute right-3 top-4 text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <StaffSidebar
              onNavigate={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-cream-100 bg-white/95 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-navy-900 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-medium text-gold-500 uppercase">
                Welcome back
              </p>
              <p className="font-display text-lg text-navy-900">{user?.name}</p>
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
