import { Languages, Sparkles, Type } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useAppState } from '../../state/useAppState';
import type { BooleanSettingKey } from '../../types/app';

interface ModeDefinition {
  key: BooleanSettingKey;
  label: string;
  icon: LucideIcon;
}

const MODES: readonly ModeDefinition[] = [
  { key: 'refine', label: 'Refine', icon: Sparkles },
  { key: 'translate', label: 'Translate', icon: Languages },
  { key: 'romanUrdu', label: 'Roman Urdu', icon: Type },
];

interface ModePillsProps {
  className?: string;
  light?: boolean;
}

export function ModePills({ className, light = false }: ModePillsProps) {
  const { settings, toggleSetting } = useAppState();

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {MODES.map(({ key, label, icon: Icon }) => {
        const isActive = settings[key];

        return (
          <button
            key={key}
            type="button"
            aria-pressed={isActive}
            onClick={() => toggleSetting(key)}
            className={cn(
              'pill px-3.5 py-2.5',
              isActive
                ? light
                  ? 'bg-white text-[#2b2338] shadow-sm'
                  : 'pill-accent'
                : light
                  ? 'border-white/50 bg-white/50 text-[#56486b] hover:bg-white/65'
                  : 'pill-soft hover:border-[var(--line-strong)]',
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={1.9} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
