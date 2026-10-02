import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { nightsBetween, todayISO } from '../utils/dates';
import { formatCurrency } from '../utils/format';
import ErrorMessage from './ErrorMessage';

export default function BookingForm({
  room,
  initialCheckIn = '',
  initialCheckOut = '',
  isAuthenticated,
  onSubmit,
  loading,
  error,
}) {
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const minOut = checkIn || todayISO();

  const nights = useMemo(
    () => nightsBetween(checkIn, checkOut),
    [checkIn, checkOut],
  );
  const estimatedTotal = nights * Number(room.pricePerNight);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ checkIn, checkOut });
  };

  const dateInvalid =
    checkIn && checkOut && (checkOut <= checkIn || checkIn < todayISO());

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-cream-100 bg-white p-6 shadow-sm"
    >
      <h3 className="font-display text-xl text-navy-900">Reserve this room</h3>
      <p className="mt-1 text-sm text-charcoal/60">
        Select your dates. Total is estimated from the nightly rate.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 flex items-center gap-1.5 font-medium text-charcoal">
            <Calendar className="h-4 w-4 text-gold-500" />
            Check-in
          </span>
          <input
            type="date"
            required
            min={todayISO()}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full rounded-lg border border-navy-800/15 bg-cream-50/50 px-3 py-2.5 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 flex items-center gap-1.5 font-medium text-charcoal">
            <Calendar className="h-4 w-4 text-gold-500" />
            Check-out
          </span>
          <input
            type="date"
            required
            min={minOut}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-lg border border-navy-800/15 bg-cream-50/50 px-3 py-2.5 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          />
        </label>
      </div>

      {dateInvalid && (
        <p className="mt-3 text-sm text-red-600">
          Check-out must be after check-in, and check-in cannot be in the past.
        </p>
      )}

      {nights > 0 && (
        <div className="mt-5 rounded-lg bg-cream-100/80 px-4 py-3 text-sm">
          <div className="flex justify-between">
            <span>
              {nights} night{nights !== 1 ? 's' : ''} ×{' '}
              {formatCurrency(room.pricePerNight)}
            </span>
            <span className="font-semibold text-navy-900">
              {formatCurrency(estimatedTotal)}
            </span>
          </div>
          <p className="mt-1 text-xs text-charcoal/55">Estimated total (not stored by the server)</p>
        </div>
      )}

      <ErrorMessage message={error} />

      {!isAuthenticated ? (
        <p className="mt-5 text-sm text-charcoal/70">
          Please{' '}
          <Link to="/login" className="font-semibold text-gold-500 underline-offset-2 hover:underline">
            sign in
          </Link>{' '}
          to complete your booking.
        </p>
      ) : (
        <button
          type="submit"
          disabled={loading || dateInvalid || !checkIn || !checkOut}
          className="mt-5 w-full rounded-lg bg-gold-500 px-4 py-3 text-sm font-semibold text-navy-950 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Booking…' : 'Confirm booking'}
        </button>
      )}
    </form>
  );
}
