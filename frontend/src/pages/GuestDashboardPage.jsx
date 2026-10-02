import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, BedDouble, ArrowRight } from 'lucide-react';
import { getMyBookings } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { isUpcoming } from '../utils/dates';

export default function GuestDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyBookings()
      .then((data) => setBookings(data.bookings || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const upcoming = bookings.filter((b) => isUpcoming(b.checkIn, b.status));
    const active = bookings.filter(
      (b) => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN',
    );
    return {
      total: bookings.length,
      upcoming: upcoming.length,
      active: active.length,
    };
  }, [bookings]);

  const upcomingBooking = useMemo(
    () =>
      bookings
        .filter((b) => isUpcoming(b.checkIn, b.status))
        .sort((a, b) => a.checkIn.localeCompare(b.checkIn))[0],
    [bookings],
  );

  const recent = useMemo(
    () =>
      [...bookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3),
    [bookings],
  );

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner label="Loading your dashboard…" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gold-500 uppercase">Guest dashboard</p>
          <h1 className="font-display mt-1 text-4xl text-navy-900">
            Hello, {user?.name?.split(' ')[0] || 'guest'}
          </h1>
        </div>
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800"
        >
          Browse rooms <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <ErrorMessage message={error} />

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total bookings" value={stats.total} icon={CalendarCheck} />
        <StatCard
          label="Upcoming stays"
          value={stats.upcoming}
          icon={BedDouble}
          accent="bg-sky-100 text-sky-700"
        />
        <StatCard
          label="Active reservations"
          value={stats.active}
          icon={CalendarCheck}
          accent="bg-emerald-100 text-emerald-700"
        />
      </div>

      {upcomingBooking && (
        <section className="mt-10 rounded-xl border border-gold-500/30 bg-gradient-to-r from-cream-100 to-white p-6">
          <p className="text-sm font-medium text-gold-500 uppercase">Next stay</p>
          <div className="mt-3">
            <BookingCard booking={upcomingBooking} />
          </div>
        </section>
      )}

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-navy-900">Recent bookings</h2>
          <Link to="/bookings" className="text-sm font-semibold text-navy-900 hover:text-gold-500">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {recent.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
          {recent.length === 0 && !error && (
            <p className="text-sm text-charcoal/60">No bookings yet — explore our rooms to get started.</p>
          )}
        </div>
      </section>
    </div>
  );
}
