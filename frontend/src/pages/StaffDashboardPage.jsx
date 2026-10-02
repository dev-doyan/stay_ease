import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, DoorOpen, CalendarCheck, ClipboardList } from 'lucide-react';
import { getRooms } from '../api/rooms';
import { getAllBookings } from '../api/bookings';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatDisplayDate } from '../utils/dates';
import { formatRoomType } from '../utils/format';

export default function StaffDashboardPage() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getRooms(), getAllBookings()])
      .then(([roomsRes, bookingsRes]) => {
        setRooms(roomsRes.rooms || []);
        setBookings(bookingsRes.bookings || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(
    () => ({
      totalRooms: rooms.length,
      available: rooms.filter((r) => r.status === 'AVAILABLE').length,
      occupied: rooms.filter((r) => r.status === 'OCCUPIED').length,
      totalBookings: bookings.length,
    }),
    [rooms, bookings],
  );

  const recentBookings = useMemo(
    () =>
      [...bookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [bookings],
  );

  if (loading) {
    return <LoadingSpinner label="Loading dashboard…" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-navy-900">Operations overview</h1>
        <p className="mt-1 text-sm text-charcoal/60">
          Live stats from rooms and bookings in your database.
        </p>
      </div>

      <ErrorMessage message={error} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total rooms" value={stats.totalRooms} icon={BedDouble} />
        <StatCard
          label="Available"
          value={stats.available}
          icon={DoorOpen}
          accent="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          label="Occupied"
          value={stats.occupied}
          icon={BedDouble}
          accent="bg-amber-100 text-amber-800"
        />
        <StatCard label="Total bookings" value={stats.totalBookings} icon={CalendarCheck} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-cream-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-navy-900">Recent bookings</h2>
            <Link to="/staff/bookings" className="text-sm font-semibold text-gold-500">
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-cream-100">
            {recentBookings.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <p className="font-medium text-navy-900">
                    Room {b.roomNumber} · {formatRoomType(b.roomType)}
                  </p>
                  <p className="text-charcoal/60">
                    {formatDisplayDate(b.checkIn)} – {formatDisplayDate(b.checkOut)}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </li>
            ))}
            {recentBookings.length === 0 && (
              <li className="py-6 text-center text-charcoal/50">No bookings yet.</li>
            )}
          </ul>
        </section>

        <section className="rounded-xl border border-cream-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-navy-900">Room status</h2>
            <Link to="/staff/rooms" className="text-sm font-semibold text-gold-500">
              Manage rooms
            </Link>
          </div>
          <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto">
            {rooms.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-lg bg-cream-50 px-3 py-2 text-sm"
              >
                <span>
                  #{r.roomNumber} · {formatRoomType(r.roomType)}
                </span>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/staff/rooms"
          className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <ClipboardList className="h-4 w-4" /> Add or edit rooms
        </Link>
        <Link
          to="/staff/bookings"
          className="inline-flex items-center gap-2 rounded-lg border border-navy-800/15 px-4 py-2.5 text-sm font-semibold"
        >
          Manage bookings
        </Link>
      </div>
    </div>
  );
}
