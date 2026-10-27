import { CircleAlert, X } from 'lucide-react';
import { useAppState } from '../../state/useAppState';

export function GlobalToast() {
  const { session, dismissError } = useAppState();

  if (!session.error) return null;

  return (
    <div
      role="alert"
      className="panel fixed right-4 bottom-28 left-4 z-[70] mx-auto flex max-w-md items-start gap-3 rounded-[1.5rem] p-4 lg:right-8 lg:bottom-8 lg:left-auto"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--warm-soft)] text-[var(--warm-strong)]">
        <CircleAlert className="h-4 w-4" strokeWidth={1.9} />
      </span>
      <p className="muted flex-1 text-xs leading-5">{session.error}</p>
      <button
        type="button"
        aria-label="Dismiss message"
        onClick={dismissError}
        className="icon-button h-8 w-8 shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
