export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const diff = (end - start) / (1000 * 60 * 60 * 24);
  return diff > 0 ? diff : 0;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDisplayDate(isoDate) {
  if (!isoDate) return '—';
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function isUpcoming(checkIn, status) {
  if (status === 'CANCELLED' || status === 'CHECKED_OUT') return false;
  const today = todayISO();
  return checkIn >= today;
}
