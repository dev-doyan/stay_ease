import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Users, ChevronLeft } from 'lucide-react';
import { getRoom } from '../api/rooms';
import { createBooking } from '../api/bookings';
import BookingForm from '../components/BookingForm';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatRoomType, ROOM_PLACEHOLDER_IMAGE } from '../utils/format';
import { ApiError } from '../api/client';

export default function RoomDetailsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isStaff } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    getRoom(id)
      .then((data) => setRoom(data.room))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async ({ checkIn, checkOut }) => {
    setBookingError('');
    setBookingLoading(true);
    try {
      const data = await createBooking({ roomId: id, checkIn, checkOut });
      navigate(`/bookings/${data.booking.id}`);
    } catch (err) {
      setBookingError(err instanceof ApiError ? err.message : 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Loading room…" />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <ErrorMessage message={error || 'Room not found'} />
        <Link to="/rooms" className="mt-6 inline-block text-sm font-semibold text-navy-900">
          ← Back to rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <Link
        to="/rooms"
        className="inline-flex items-center gap-1 text-sm font-medium text-charcoal/70 hover:text-navy-900"
      >
        <ChevronLeft className="h-4 w-4" /> All rooms
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-xl bg-navy-900 shadow-lg">
            <img
              src={ROOM_PLACEHOLDER_IMAGE}
              alt=""
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
          <p className="mt-2 text-xs text-charcoal/50">
            Room photos are not returned by the current rooms API; placeholder shown until backend image listing is available.
          </p>
        </div>

        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={room.status} />
            <span className="text-sm text-charcoal/60">Room {room.roomNumber}</span>
          </div>
          <h1 className="font-display mt-2 text-3xl text-navy-900">
            {formatRoomType(room.roomType)}
          </h1>
          <p className="mt-2 font-display text-2xl text-gold-500">
            {formatCurrency(room.pricePerNight)}
            <span className="font-sans text-sm text-charcoal/60"> / night</span>
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-charcoal/70">
            <Users className="h-4 w-4 text-gold-500" />
            Capacity: {room.capacity} guests
          </div>
          {room.description && (
            <p className="mt-6 leading-relaxed text-charcoal/80">{room.description}</p>
          )}

          {isStaff ? (
            <p className="mt-8 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
              You are signed in as staff. Switch to a guest account to make a personal booking, or manage this room in the staff panel.
            </p>
          ) : (
            <div className="mt-8">
              <BookingForm
                room={room}
                initialCheckIn={searchParams.get('checkIn') || ''}
                initialCheckOut={searchParams.get('checkOut') || ''}
                isAuthenticated={isAuthenticated}
                onSubmit={handleBook}
                loading={bookingLoading}
                error={bookingError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
