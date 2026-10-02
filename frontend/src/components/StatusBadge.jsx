const styles = {
  AVAILABLE: 'bg-emerald-100 text-emerald-800',
  OCCUPIED: 'bg-amber-100 text-amber-900',
  CONFIRMED: 'bg-sky-100 text-sky-900',
  CHECKED_IN: 'bg-violet-100 text-violet-900',
  CHECKED_OUT: 'bg-slate-100 text-slate-700',
  CANCELLED: 'bg-red-100 text-red-800',
};

const labels = {
  CHECKED_IN: 'Checked in',
  CHECKED_OUT: 'Checked out',
};

export default function StatusBadge({ status }) {
  if (!status) return null;
  const label =
    labels[status] ||
    status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase ${styles[status] || 'bg-cream-100 text-charcoal'}`}
    >
      {label}
    </span>
  );
}
