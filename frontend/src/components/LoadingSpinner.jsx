import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-8 w-8';
  return (
    <div className="flex flex-col items-center gap-3 text-navy-800/70">
      <Loader2 className={`${sizeClass} animate-spin text-gold-500`} aria-hidden />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
