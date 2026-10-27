import auraBlob from '../../assets/illustrations/aura-blob.webp';
import focusStar from '../../assets/illustrations/focus-star.webp';
import moodOrb from '../../assets/illustrations/mood-orb.webp';
import { cn } from '../../lib/cn';

interface IllustrationProps {
  className?: string;
}

export function AuraMascot({ className }: IllustrationProps) {
  return (
    <img
      src={auraBlob}
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
      src={focusStar}
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
      src={moodOrb}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
      className={cn('pointer-events-none select-none object-contain', className)}
    />
  );
}
