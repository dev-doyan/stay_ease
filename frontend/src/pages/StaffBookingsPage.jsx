import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllBookings,
  checkInBooking,
  checkOutBooking,
  cancelBooking,
} from '../api/bookings';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatDisplayDate } from '../utils/dates';
import { formatCurrency, formatRoomType, shortId } from '../utils/format';
import { ApiError } from '../api/client';

export default function StaffBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = () => {
    setLoading(true);
    getAllBookings()
      .then((data) => setBookings(data.bookings || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const runAction = async () => {
    if (!pendingAction) return;
    setActionLoading(true);
    setError('');
    try {
      const { type, booking } = pendingAction;
      if (type === 'check-in') await checkInBooking(booking.id);
      if (type === 'check-out') await checkOutBooking(booking.id);
      if (type === 'cancel') await cancelBooking(booking.id);
      setPendingAction(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const actionCopy = {
    'check-in': {
      title: 'Check guest in?',
      message: 'This marks the booking as checked in and sets the room to occupied.',
      label: 'Check in',
    },
    'check-out': {
      title: 'Check guest out?',
      message: 'This completes the stay and marks the room as available.',
      label: 'Check out',
    },
    cancel: {
      title: 'Cancel booking?',
      message: 'Only confirmed bookings can be cancelled.',
      label: 'Cancel booking',
    },
  };

  if (loading) return <LoadingSpinner label="Loading bookings…" />;

  const pending = pendingAction ? actionCopy[pendingAction.type] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-navy-900">Booking management</h1>
        <p className="text-sm text-charcoal/60">
          Guest names are not included in the staff bookings API — guest ID is shown instead.
        </p>
      </div>

      <ErrorMessage message={error} onRetry={load} />

      <div className="hidden overflow-hidden rounded-xl border border-cream-100 bg-white shadow-sm lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-cream-50 text-xs tracking-wide text-charcoal/60 uppercase">
            <tr>
              <th className="px-4 py-3">Booking</th>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-cream-50/50">
                <td className="px-4 py-3 font-medium">{shortId(b.id)}</td>
                <td className="px-4 py-3 font-mono text-xs text-charcoal/70">
                  {b.userId?.slice(0, 8)}…
                </td>
                <td className="px-4 py-3">
                  {formatRoomType(b.roomType)} #{b.roomNumber}
                  <span className="block text-xs text-charcoal/50">
                    {formatCurrency(b.pricePerNight)}/night
                  </span>
                </td>
                <td className="px-4 py-3 text-charcoal/80">
                  {formatDisplayDate(b.checkIn)} → {formatDisplayDate(b.checkOut)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <Link
                      to={`/bookings/${b.id}`}
                      className="rounded px-2 py-1 text-xs font-medium hover:bg-cream-100"
                    >
                      View
                    </Link>
                    {b.status === 'CONFIRMED' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setPendingAction({ type: 'check-in', booking: b })}
                          className="rounded px-2 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-50"
                        >
                          Check in
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingAction({ type: 'cancel', booking: b })}
                          className="rounded px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {b.status === 'CHECKED_IN' && (
                      <button
                        type="button"
                        onClick={() => setPendingAction({ type: 'check-out', booking: b })}
                        className="rounded px-2 py-1 text-xs font-medium text-violet-800 hover:bg-violet-50"
                      >
                        Check out
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <p className="py-12 text-center text-charcoal/50">No bookings found.</p>
        )}
      </div>

      <div className="space-y-4 lg:hidden">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-xl border border-cream-100 bg-white p-4 shadow-sm">
            <div className="flex justify-between gap-2">
              <p className="font-medium">{shortId(b.id)}</p>
              <StatusBadge status={b.status} />
            </div>
            <p className="mt-2 text-sm">
              {formatRoomType(b.roomType)} · Room {b.roomNumber}
            </p>
            <p className="text-xs text-charcoal/60">Guest ID: {b.userId}</p>
            <p className="mt-2 text-sm text-charcoal/70">
              {formatDisplayDate(b.checkIn)} – {formatDisplayDate(b.checkOut)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link to={`/bookings/${b.id}`} className="text-xs font-semibold underline">
                Details
              </Link>
              {b.status === 'CONFIRMED' && (
                <>
                  <button
                    type="button"
                    onClick={() => setPendingAction({ type: 'check-in', booking: b })}
                    className="text-xs font-semibold text-emerald-800"
                  >
                    Check in
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingAction({ type: 'cancel', booking: b })}
                    className="text-xs font-semibold text-red-700"
                  >
                    Cancel
                  </button>
                </>
              )}
              {b.status === 'CHECKED_IN' && (
                <button
                  type="button"
                  onClick={() => setPendingAction({ type: 'check-out', booking: b })}
                  className="text-xs font-semibold text-violet-800"
                >
                  Check out
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        onClose={() => setPendingAction(null)}
        onConfirm={runAction}
        title={pending?.title}
        message={pending?.message}
        confirmLabel={pending?.label}
        destructive={pendingAction?.type === 'cancel'}
        loading={actionLoading}
      />
    </div>
  );
}
