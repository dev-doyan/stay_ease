import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import {
  formatCurrency,
  formatRoomType,
  ROOM_PLACEHOLDER_IMAGE,
} from '../utils/format';

export default function RoomCard({ room, imageUrl, checkIn, checkOut }) {
  const query =
    checkIn && checkOut
      ? `?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`
      : '';

  return (
    <article className="group overflow-hidden rounded-lg border border-cream-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 overflow-hidden bg-navy-900">
        <img
          src={imageUrl || ROOM_PLACEHOLDER_IMAGE}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <StatusBadge status={room.status} />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium tracking-wider text-gold-500 uppercase">
              Room {room.roomNumber}
            </p>
            <h3 className="font-display text-xl text-navy-900">
              {formatRoomType(room.roomType)}
            </h3>
          </div>
          <p className="text-right">
            <span className="font-display text-lg text-navy-900">
              {formatCurrency(room.pricePerNight)}
            </span>
            <span className="block text-xs text-charcoal/60">/ night</span>
          </p>
        </div>
        {room.description && (
          <p className="mt-2 line-clamp-2 text-sm text-charcoal/70">
            {room.description}
          </p>
        )}
        <div className="mt-4 flex items-center gap-1.5 text-sm text-charcoal/70">
          <Users className="h-4 w-4 text-gold-500" />
          Up to {room.capacity} guests
        </div>
        <Link
          to={`/rooms/${room.id}${query}`}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800"
        >
          View details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
