import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Toggle } from './Toggle';

interface SettingRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
}

export function SettingRow({
  label,
  description,
  checked,
  onChange,
  icon: Icon,
  disabled,
  className,
}: SettingRowProps) {
  return (
    <div className={cn('flex items-center justify-between gap-4 py-3.5', className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl accent-surface">
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
        )}
        <div className="min-w-0">
          <p className="text-sm font-bold">{label}</p>
          {description && <p className="muted mt-1 text-xs leading-5">{description}</p>}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={`Toggle ${label}`} disabled={disabled} />
    </div>
  );
}
