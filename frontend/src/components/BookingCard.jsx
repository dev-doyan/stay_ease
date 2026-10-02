import { Link } from 'react-router-dom';
import { CalendarDays, DoorOpen } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDisplayDate } from '../utils/dates';
import { formatCurrency, formatRoomType, shortId } from '../utils/format';

export default function BookingCard({ booking, showCancel, onCancel }) {
  const canCancel = booking.status === 'CONFIRMED';

  return (
    <div className="rounded-xl border border-cream-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-charcoal/50 uppercase">
            Booking {shortId(booking.id)}
          </p>
          <h3 className="font-display text-lg text-navy-900">
            {formatRoomType(booking.roomType)} · Room {booking.roomNumber}
          </h3>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="mt-4 grid gap-2 text-sm text-charcoal/80 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gold-500" />
          {formatDisplayDate(booking.checkIn)} → {formatDisplayDate(booking.checkOut)}
        </div>
        <div className="flex items-center gap-2">
          <DoorOpen className="h-4 w-4 text-gold-500" />
          {formatCurrency(booking.pricePerNight)} / night
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to={`/bookings/${booking.id}`}
          className="rounded-lg border border-navy-800/15 px-4 py-2 text-sm font-medium transition hover:bg-cream-100"
        >
          View details
        </Link>
        {showCancel && canCancel && onCancel && (
          <button
            type="button"
            onClick={() => onCancel(booking)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
          >
            Cancel booking
          </button>
        )}
      </div>
    </div>
  );
}
