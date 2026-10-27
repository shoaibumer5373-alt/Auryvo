import { ChevronDown } from 'lucide-react';
import { useId, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly SelectOption[];
  hint?: string;
  selectClassName?: string;
}

export function SelectField({
  label,
  options,
  hint,
  id,
  className,
  selectClassName,
  ...selectProps
}: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className={className}>
      <label className="field-label" htmlFor={fieldId}>
        {label}
      </label>
      <div className="relative">
        <select
          id={fieldId}
          className={cn(
            'input-shell appearance-none px-4 py-3 pr-10 text-sm font-semibold',
            selectClassName,
          )}
          {...selectProps}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]"
          strokeWidth={2}
        />
      </div>
      {hint && <p className="faint mt-2 text-xs leading-5">{hint}</p>}
    </div>
  );
}
