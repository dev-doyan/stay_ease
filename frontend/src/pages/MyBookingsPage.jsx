import { useEffect, useState } from 'react';
import { CalendarOff } from 'lucide-react';
import { getMyBookings, cancelBooking } from '../api/bookings';
import BookingCard from '../components/BookingCard';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Link } from 'react-router-dom';
import { ApiError } from '../api/client';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingCancel, setPendingCancel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const load = () => {
    setLoading(true);
    getMyBookings()
      .then((data) => setBookings(data.bookings || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async () => {
    if (!pendingCancel) return;
    setCancelLoading(true);
    try {
      await cancelBooking(pendingCancel.id);
      setPendingCancel(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Cancellation failed');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner label="Loading bookings…" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <h1 className="font-display text-4xl text-navy-900">My bookings</h1>
      <p className="mt-2 text-charcoal/70">View and manage your reservations.</p>

      <ErrorMessage message={error} onRetry={load} />

      {bookings.length === 0 && !error ? (
        <div className="mt-10">
          <EmptyState
            icon={CalendarOff}
            title="No bookings yet"
            description="When you reserve a room, it will appear here."
            action={
              <Link
                to="/rooms"
                className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Browse rooms
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              showCancel
              onCancel={setPendingCancel}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingCancel)}
        onClose={() => setPendingCancel(null)}
        onConfirm={handleCancel}
        title="Cancel booking?"
        message="This will cancel your confirmed reservation. This action cannot be undone from the guest app."
        confirmLabel="Cancel booking"
        destructive
        loading={cancelLoading}
      />
    </div>
  );
}
