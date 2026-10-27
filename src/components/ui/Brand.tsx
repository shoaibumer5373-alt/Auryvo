import { cn } from '../../lib/cn';

interface BrandProps {
  compact?: boolean;
  className?: string;
}

export function Brand({ compact = false, className }: BrandProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'brand-mark rounded-[38%_42%_46%_38%]',
          compact && 'h-10 w-10 rounded-[40%_46%_38%_42%]',
        )}
        aria-hidden="true"
      >
        <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none">
          <path
            d="M18 47c5.8-16.7 12.3-25 20-25 4.1 0 7.4 3.3 7.4 7.4 0 7.7-8.3 17.6-27.4 17.6Z"
            stroke="white"
            strokeWidth="4.6"
            strokeLinecap="round"
          />
          <path d="M28 39h18" stroke="white" strokeWidth="4.6" strokeLinecap="round" />
        </svg>
      </div>
      {!compact && <span className="brand-word text-[var(--text-primary)]">auryvo</span>}
    </div>
  );
}
