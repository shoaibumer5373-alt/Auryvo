import { Bell, Moon, Search, Sun } from 'lucide-react';
import { getNavigationItem } from '../../data/navigation';
import { useAppState } from '../../state/useAppState';
import type { PageId } from '../../types/app';
import { Brand } from '../ui/Brand';
import { IconButton } from '../ui/IconButton';

interface TopBarProps {
  activePage: PageId;
  onOpenSearch: () => void;
}

export function TopBar({ activePage, onOpenSearch }: TopBarProps) {
  const { settings, updateSetting } = useAppState();
  const currentPage = getNavigationItem(activePage);
  const isDark = settings.theme === 'dark';

  return (
    <header className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-4 sm:px-7 lg:px-9">
      <div className="lg:hidden">
        <Brand compact />
      </div>

      <div className="hidden min-w-44 lg:block">
        <p className="faint text-[0.65rem] font-bold uppercase tracking-[0.18em]">Workspace</p>
        <h2 className="mt-0.5 text-lg font-bold tracking-tight">{currentPage.label}</h2>
      </div>

      <button
        type="button"
        onClick={onOpenSearch}
        className="pill pill-white ml-auto h-11 px-4 text-xs sm:w-64 sm:justify-start"
        aria-label="Open page search"
      >
        <Search className="h-4 w-4" strokeWidth={1.9} />
        <span className="hidden flex-1 text-left sm:inline">Search Auryvo…</span>
        <kbd className="hidden rounded-md border border-[var(--line)] bg-[var(--panel-soft)] px-1.5 py-0.5 font-sans text-[0.6rem] sm:inline">
          ⌘ K
        </kbd>
      </button>

      <span className="pill hidden items-center gap-2 border border-[var(--line)] bg-[var(--panel-soft)] px-3 py-2 text-[0.7rem] xl:inline-flex">
        <span className="h-2 w-2 rounded-full bg-[#55c79e] shadow-[0_0_0_4px_rgba(85,199,158,0.15)]" />
        All systems ready
      </span>

      <IconButton
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        onClick={() => updateSetting('theme', isDark ? 'light' : 'dark')}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </IconButton>

      <IconButton aria-label="Notifications" className="relative hidden sm:inline-grid">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2.5 right-3 h-1.5 w-1.5 rounded-full bg-[var(--warm-strong)]" />
      </IconButton>

      <button
        type="button"
        aria-label="Open profile"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#2b2338] text-xs font-extrabold text-white"
      >
        SA
      </button>
    </header>
  );
}
