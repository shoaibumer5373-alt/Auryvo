import { ChevronRight, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/cn';
import { NAVIGATION_ITEMS } from '../../data/navigation';
import type { PageId } from '../../types/app';
import { Brand } from '../ui/Brand';

interface SidebarProps {
  activePage: PageId;
  onPageChange: (page: PageId) => void;
}

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <aside className="panel sticky top-7 hidden h-[calc(100vh-3.5rem)] flex-col rounded-[2.2rem] p-5 lg:flex">
      <Brand className="px-2 pt-2" />

      <div className="hero-gradient relative mt-8 overflow-hidden rounded-[1.7rem] p-4 text-[#2b2338]">
        <div className="grain-overlay" />
        <div className="relative">
          <span className="pill bg-white/50 px-2.5 py-1 text-[0.62rem] text-[#4b356c]">
            Assistant ready
          </span>
          <p className="mt-4 text-lg leading-tight font-bold tracking-tight">
            Your voice,
            <br />
            beautifully typed.
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/35">
            <div className="h-full w-[78%] rounded-full bg-white/85" />
          </div>
        </div>
      </div>

      <nav
        aria-label="Primary navigation"
        className="soft-scrollbar mt-7 min-h-0 flex-1 overflow-y-auto"
      >
        <ul className="space-y-1.5">
          {NAVIGATION_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activePage === id;

            return (
              <li key={id}>
                <button
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onPageChange(id)}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition',
                    isActive
                      ? 'accent-surface'
                      : 'muted hover:bg-[var(--panel-soft)] hover:text-[var(--text-primary)]',
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  <span className="flex-1 text-left">{label}</span>
                  {isActive && <ChevronRight className="h-4 w-4" strokeWidth={2} />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-5 rounded-[1.5rem] border border-[var(--line)] bg-[var(--panel-soft)] p-4">
        <div className="flex items-center gap-2 text-xs font-bold">
          <ShieldCheck className="h-4 w-4 accent-text" strokeWidth={1.8} />
          Local bridge
        </div>
        <p className="muted mt-1.5 text-xs leading-5">Secure pairing is ready on this device.</p>
      </div>
    </aside>
  );
}
