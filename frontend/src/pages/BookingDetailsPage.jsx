import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getBooking, cancelBooking } from '../api/bookings';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { nightsBetween, formatDisplayDate } from '../utils/dates';
import { formatCurrency, formatRoomType, shortId } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const { isStaff } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const load = () => {
    setLoading(true);
    getBooking(id)
      .then((data) => setBooking(data.booking))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const nights = booking ? nightsBetween(booking.checkIn, booking.checkOut) : 0;
  const estimatedTotal = booking
    ? nights * Number(booking.pricePerNight)
    : 0;

  const canCancel = booking?.status === 'CONFIRMED';

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await cancelBooking(id);
      setConfirmOpen(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Cancellation failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner label="Loading booking…" />
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <ErrorMessage message={error} />
        <Link to={isStaff ? '/staff/bookings' : '/bookings'} className="mt-4 inline-block text-sm font-semibold">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <Link
        to={isStaff ? '/staff/bookings' : '/bookings'}
        className="text-sm font-medium text-charcoal/70 hover:text-navy-900"
      >
        ← Back to bookings
      </Link>

      <div className="mt-6 rounded-2xl border border-cream-100 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-charcoal/50 uppercase">
              Booking {shortId(booking.id)}
            </p>
            <h1 className="font-display mt-1 text-3xl text-navy-900">
              {formatRoomType(booking.roomType)} · Room {booking.roomNumber}
            </h1>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-cream-50 p-4">
            <dt className="text-xs text-charcoal/55 uppercase">Check-in</dt>
            <dd className="mt-1 font-medium">{formatDisplayDate(booking.checkIn)}</dd>
          </div>
          <div className="rounded-lg bg-cream-50 p-4">
            <dt className="text-xs text-charcoal/55 uppercase">Check-out</dt>
            <dd className="mt-1 font-medium">{formatDisplayDate(booking.checkOut)}</dd>
          </div>
          <div className="rounded-lg bg-cream-50 p-4">
            <dt className="text-xs text-charcoal/55 uppercase">Nights</dt>
            <dd className="mt-1 font-medium">{nights}</dd>
          </div>
          <div className="rounded-lg bg-cream-50 p-4">
            <dt className="text-xs text-charcoal/55 uppercase">Rate</dt>
            <dd className="mt-1 font-medium">
              {formatCurrency(booking.pricePerNight)} / night
            </dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-cream-100 pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/70">Estimated total</span>
            <span className="font-display text-xl text-navy-900">
              {formatCurrency(estimatedTotal)}
            </span>
          </div>
          <p className="mt-1 text-xs text-charcoal/50">
            Calculated from nightly rate × nights (not stored as a total on the server).
          </p>
        </div>

        <ErrorMessage message={error} />

        {canCancel && !isStaff && (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="mt-8 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Cancel booking
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleCancel}
        title="Cancel this booking?"
        message="Only confirmed bookings can be cancelled. You'll need to book again if you change your mind."
        confirmLabel="Yes, cancel"
        destructive
        loading={actionLoading}
      />
    </div>
  );
}
