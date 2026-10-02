import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, BedDouble, ArrowRight } from 'lucide-react';
import { getRooms } from '../api/rooms';
import RoomCard from '../components/RoomCard';
import { RoomCardSkeleton } from '../components/Skeleton';
import ErrorMessage from '../components/ErrorMessage';
import { HERO_IMAGE } from '../utils/format';
import { todayISO } from '../utils/dates';

export default function HomePage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    getRooms()
      .then((data) => setRooms(data.rooms || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const featured = rooms
    .filter((r) => r.status === 'AVAILABLE')
    .slice(0, 3);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', String(guests));
    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden bg-navy-950 text-white">
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/40" />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 pb-20 pt-32 lg:min-h-[88vh] lg:px-8 lg:pt-40">
          <p className="animate-fade-in text-sm font-medium tracking-[0.2em] text-gold-400 uppercase">
            Premium hospitality
          </p>
          <h1 className="animate-fade-in font-display mt-4 max-w-2xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Stay somewhere you&apos;ll love.
          </h1>
          <p className="animate-fade-in mt-5 max-w-xl text-lg text-white/80">
            Discover thoughtfully appointed rooms, effortless booking, and a
            stay that feels personal from the moment you arrive.
          </p>

          <form
            onSubmit={handleSearch}
            className="animate-fade-in mt-10 grid gap-3 rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4 lg:gap-4"
          >
            <label className="text-sm">
              <span className="mb-1 block text-white/70">Check-in</span>
              <input
                type="date"
                min={todayISO()}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full rounded-lg border-0 bg-white px-3 py-2.5 text-charcoal"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-white/70">Check-out</span>
              <input
                type="date"
                min={checkIn || todayISO()}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-lg border-0 bg-white px-3 py-2.5 text-charcoal"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-white/70">Guests (capacity filter)</span>
              <input
                type="number"
                min={1}
                max={10}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full rounded-lg border-0 bg-white px-3 py-2.5 text-charcoal"
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-lg bg-gold-500 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-400"
              >
                Search rooms
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gold-500 uppercase">Featured</p>
            <h2 className="font-display mt-1 text-3xl text-navy-900">Rooms we recommend</h2>
          </div>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-1 text-sm font-semibold text-navy-900 hover:text-gold-500"
          >
            View all rooms <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ErrorMessage message={error} onRetry={() => window.location.reload()} />

        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => <RoomCardSkeleton key={i} />)}
          {!loading &&
            featured.map((room) => (
              <RoomCard key={room.id} room={room} checkIn={checkIn} checkOut={checkOut} />
            ))}
        </div>
        {!loading && !error && featured.length === 0 && (
          <p className="mt-8 text-center text-charcoal/60">
            No available rooms right now. Check back soon or browse all rooms.
          </p>
        )}
      </section>

      <section className="bg-cream-100/80 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-display text-center text-3xl text-navy-900">Why StayEase</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: BedDouble,
                title: 'Comfortable stays',
                text: 'Every room is curated for rest, with clear details before you book.',
              },
              {
                icon: Sparkles,
                title: 'Easy booking',
                text: 'Pick your dates, see your estimate, and confirm in a few clicks.',
              },
              {
                icon: Shield,
                title: 'Secure reservations',
                text: 'Your session is protected with secure HTTP-only authentication.',
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-xl border border-cream-100 bg-white p-8 text-center shadow-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 text-gold-500">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display mt-5 text-xl text-navy-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-8">
        <h2 className="font-display text-3xl text-navy-900">Ready for your next getaway?</h2>
        <p className="mx-auto mt-3 max-w-lg text-charcoal/70">
          Browse our collection of rooms and find the perfect match for your dates.
        </p>
        <Link
          to="/rooms"
          className="mt-8 inline-flex rounded-lg bg-navy-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
        >
          Explore rooms
        </Link>
      </section>
    </>
  );
}
