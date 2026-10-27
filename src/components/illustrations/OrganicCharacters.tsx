import { cn } from '../../lib/cn';

interface IllustrationProps {
  className?: string;
}

export function AuraMascot({ className }: IllustrationProps) {
  return (
    <img
      src="/illustrations/aura-blob.webp"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={cn('pointer-events-none select-none object-contain', className)}
    />
  );
}

export function FocusStar({ className }: IllustrationProps) {
  return (
    <img
      src="/illustrations/focus-star.webp"
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
      className={cn('pointer-events-none select-none object-contain', className)}
    />
  );
}

export function MoodOrb({ className }: IllustrationProps) {
  return (
    <img
      src="/illustrations/mood-orb.webp"
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
      className={cn('pointer-events-none select-none object-contain', className)}
    />
  );
}
