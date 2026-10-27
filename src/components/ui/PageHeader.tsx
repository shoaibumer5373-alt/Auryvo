import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <header
      className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}
    >
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] accent-text">{eyebrow}</p>
        <h1 className="text-3xl font-bold tracking-[-0.045em] sm:text-[2.6rem] sm:leading-[1.05]">
          {title}
        </h1>
        {description && <p className="muted mt-3 text-sm leading-6 sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
