export function formatCurrency(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatRoomType(type) {
  if (!type) return '—';
  return type.charAt(0) + type.slice(1).toLowerCase();
}

export function shortId(id) {
  if (!id) return '—';
  return id.slice(0, 8).toUpperCase();
}

export const ROOM_PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80';

export const HERO_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80';
