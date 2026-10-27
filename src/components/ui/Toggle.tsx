import { cn } from '../../lib/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ checked, onChange, label, disabled, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      data-state={checked ? 'on' : 'off'}
      onClick={() => onChange(!checked)}
      className={cn('toggle', disabled && 'opacity-50', className)}
    >
      <span className="toggle-thumb" />
    </button>
  );
}
