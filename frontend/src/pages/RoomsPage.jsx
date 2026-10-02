import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { getRooms } from '../api/rooms';
import RoomCard from '../components/RoomCard';
import { RoomCardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { BedDouble } from 'lucide-react';

export default function RoomsPage() {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sort, setSort] = useState('price-asc');

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = Number(searchParams.get('guests') || 0);

  const load = () => {
    setLoading(true);
    setError('');
    getRooms()
      .then((data) => setRooms(data.rooms || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    let list = [...rooms];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.roomNumber?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q),
      );
    }
    if (typeFilter !== 'ALL') list = list.filter((r) => r.roomType === typeFilter);
    if (statusFilter !== 'ALL') list = list.filter((r) => r.status === statusFilter);
    if (guests > 0) list = list.filter((r) => Number(r.capacity) >= guests);

    list.sort((a, b) => {
      const pa = Number(a.pricePerNight);
      const pb = Number(b.pricePerNight);
      if (sort === 'price-asc') return pa - pb;
      if (sort === 'price-desc') return pb - pa;
      return a.roomNumber.localeCompare(b.roomNumber);
    });
    return list;
  }, [rooms, search, typeFilter, statusFilter, sort, guests]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-gold-500 uppercase">Accommodations</p>
        <h1 className="font-display mt-1 text-4xl text-navy-900">Our rooms</h1>
        <p className="mt-3 text-charcoal/70">
          Filter by type, availability, or capacity. All listings come directly from the hotel system.
        </p>
      </div>

      <div className="mt-10 rounded-xl border border-cream-100 bg-white p-4 shadow-sm lg:p-5">
        <div className="grid gap-4 lg:grid-cols-4">
          <label className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
            <input
              type="search"
              placeholder="Search by room number or description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-navy-800/10 py-2.5 pr-3 pl-10 text-sm outline-none focus:border-gold-500"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 flex items-center gap-1 text-charcoal/70">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Type
            </span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-lg border border-navy-800/10 px-3 py-2.5"
            >
              <option value="ALL">All types</option>
              <option value="SINGLE">Single</option>
              <option value="DOUBLE">Double</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-charcoal/70">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-navy-800/10 px-3 py-2.5"
            >
              <option value="ALL">All statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-charcoal/60">
            {filtered.length} room{filtered.length !== 1 ? 's' : ''} shown
            {guests > 0 && ` · ${guests}+ guests`}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-navy-800/10 px-3 py-2 text-sm"
          >
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="room">Room number</option>
          </select>
        </div>
      </div>

      <ErrorMessage message={error} onRetry={load} />

      <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <RoomCardSkeleton key={i} />)}
        {!loading &&
          filtered.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              checkIn={checkIn}
              checkOut={checkOut}
            />
          ))}
      </div>

      {!loading && !error && filtered.length === 0 && (
        <div className="mt-10">
          <EmptyState
            icon={BedDouble}
            title="No rooms match your filters"
            description="Try adjusting your search or browse all rooms without filters."
            action={
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setTypeFilter('ALL');
                  setStatusFilter('ALL');
                }}
                className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Clear filters
              </button>
            }
          />
        </div>
      )}
    </div>
  );
}
