import {
  Boxes,
  Home,
  Languages,
  MoreHorizontal,
  Mic,
  Palette,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';
import type { PageId } from '../../types/app';

interface BottomNavProps {
  activePage: PageId;
  onPageChange: (page: PageId) => void;
}

interface NavAction {
  id: PageId | 'more';
  label: string;
  icon: LucideIcon;
}

const PRIMARY_ACTIONS: readonly NavAction[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'refinement', label: 'Refine', icon: Sparkles },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'translation', label: 'Translate', icon: Languages },
  { id: 'more', label: 'More', icon: MoreHorizontal },
];

const MORE_ACTIONS: readonly {
  id: PageId;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  { id: 'models', label: 'Models', description: 'Gateways & AI models', icon: Boxes },
  { id: 'appearance', label: 'Appearance', description: 'Theme & overlay', icon: Palette },
  { id: 'remote', label: 'Remote Control', description: 'Pair your phone', icon: Smartphone },
];

export function BottomNav({ activePage, onPageChange }: BottomNavProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreIsActive = MORE_ACTIONS.some((action) => action.id === activePage);

  useEffect(() => {
    if (!isMoreOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMoreOpen(false);
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMoreOpen]);

  function handleAction(id: PageId | 'more') {
    if (id === 'more') {
      setIsMoreOpen(true);
      return;
    }

    setIsMoreOpen(false);
    onPageChange(id);
  }

  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className="floating-nav fixed right-4 bottom-4 left-4 z-40 mx-auto flex max-w-md items-end justify-around rounded-[1.8rem] px-2 py-2 lg:hidden"
      >
        {PRIMARY_ACTIONS.map(({ id, label, icon: Icon }) => {
          const isActive = id === 'more' ? moreIsActive : activePage === id;
          const isCenter = id === 'voice';

          return (
            <button
              key={id}
              type="button"
              aria-current={isActive && !isCenter ? 'page' : undefined}
              onClick={() => handleAction(id)}
              className={cn(
                'flex min-w-14 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.62rem] font-bold transition',
                isActive ? 'accent-text' : 'faint',
              )}
            >
              <span
                className={cn(
                  'grid h-10 w-10 place-items-center rounded-2xl transition',
                  isCenter && 'text-white shadow-lg',
                  isCenter && !isActive && 'opacity-90',
                )}
                style={isCenter ? { backgroundColor: 'var(--accent)' } : undefined}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
              </span>
              {label}
            </button>
          );
        })}
      </nav>

      {isMoreOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-[#171225]/35 backdrop-blur-sm"
            onClick={() => setIsMoreOpen(false)}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-label="More pages"
            className="panel absolute right-3 bottom-3 left-3 rounded-[2rem] p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">More</h2>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMoreOpen(false)}
                className="icon-button h-9 w-9"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {MORE_ACTIONS.map(({ id, label, description, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleAction(id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl p-3 text-left transition',
                    activePage === id ? 'accent-surface' : 'hover:bg-[var(--panel-soft)]',
                  )}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--panel-soft)]">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold">{label}</span>
                    <span className="muted block text-xs">{description}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
