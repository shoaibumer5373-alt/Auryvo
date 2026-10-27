import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--line-strong)] px-6 py-10 text-center">
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl accent-surface">
        <Icon className="h-5 w-5" strokeWidth={1.7} />
      </span>
      <p className="text-sm font-bold">{title}</p>
      <p className="muted mt-1 max-w-xs text-xs leading-5">{description}</p>
    </div>
  );
}
