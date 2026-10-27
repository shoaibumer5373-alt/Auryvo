import { Languages, Mic, Sparkles, WandSparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { getPipelineMode, PIPELINE_MODES, type PipelineModeId } from '../../lib/pipeline';
import { useAppState } from '../../state/useAppState';

const MODE_ICONS: Record<PipelineModeId, LucideIcon> = {
  raw: Mic,
  refined: Sparkles,
  translated: Languages,
  unified: WandSparkles,
};

export function ModeCards() {
  const { settings, updateSetting } = useAppState();
  const activeMode = getPipelineMode(settings).id;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {PIPELINE_MODES.map((mode) => {
        const Icon = MODE_ICONS[mode.id];
        const isActive = mode.id === activeMode;

        return (
          <button
            key={mode.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => {
              updateSetting('refine', mode.refine);
              updateSetting('translate', mode.translate);
            }}
            className={cn(
              'panel-hover panel group relative overflow-hidden rounded-[1.6rem] p-5 text-left',
              isActive && 'accent-border border-2',
            )}
          >
            <span className="faint absolute top-4 right-4 text-[0.65rem] font-bold tracking-widest">
              0{mode.combination}
            </span>
            <span
              className={cn(
                'mb-5 grid h-11 w-11 place-items-center rounded-2xl transition',
                isActive ? 'accent-surface' : 'bg-[var(--panel-soft)] text-[var(--text-secondary)]',
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <p className="pr-7 text-sm font-bold">{mode.title}</p>
            <p className="muted mt-2 text-xs leading-5">{mode.description}</p>
          </button>
        );
      })}
    </div>
  );
}
