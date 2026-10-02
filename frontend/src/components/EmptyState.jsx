export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-navy-800/15 bg-white px-6 py-14 text-center">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cream-100 text-gold-500">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="font-display text-xl text-navy-900">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-charcoal/70">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
