export default function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="rounded-xl border border-cream-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-charcoal/60">{label}</p>
          <p className="mt-1 font-display text-3xl text-navy-900">{value}</p>
        </div>
        {Icon && (
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-lg ${accent || 'bg-cream-100 text-gold-500'}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
