import { cn } from '../../lib/cn';

interface WaveformProps {
  levels: readonly number[];
  active?: boolean;
  tone?: 'accent' | 'light';
  className?: string;
  barClassName?: string;
}

export function Waveform({
  levels,
  active = false,
  tone = 'accent',
  className,
  barClassName,
}: WaveformProps) {
  return (
    <div
      className={cn('flex h-20 items-center justify-center gap-[3px]', className)}
      aria-hidden="true"
    >
      {levels.map((level, index) => (
        <span
          key={index}
          className={cn('wave-bar', active && 'opacity-100', !active && 'opacity-55', barClassName)}
          style={{
            height: `${Math.max(8, Math.min(100, level * 100))}%`,
            ...(tone === 'light' ? { backgroundColor: 'rgb(255 255 255 / 82%)' } : {}),
          }}
        />
      ))}
    </div>
  );
}
