import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface SegmentedOption<Value extends string> {
  value: Value;
  label: string;
  icon?: LucideIcon;
}

interface SegmentedControlProps<Value extends string> {
  label: string;
  value: Value;
  options: readonly SegmentedOption<Value>[];
  onChange: (value: Value) => void;
  className?: string;
}

export function SegmentedControl<Value extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedControlProps<Value>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'inline-flex rounded-2xl border border-[var(--line)] bg-[var(--panel-soft)] p-1',
        className,
      )}
    >
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition sm:text-sm',
              isActive
                ? 'bg-[var(--panel-strong)] text-[var(--text-primary)] shadow-sm'
                : 'muted hover:text-[var(--text-primary)]',
            )}
          >
            {Icon && <Icon className="h-4 w-4" strokeWidth={1.8} />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
