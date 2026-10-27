import { useEffect, useState, type ReactNode } from 'react';
import type { PageId } from '../../types/app';
import { BottomNav } from './BottomNav';
import { CommandPalette } from './CommandPalette';
import { GlobalToast } from './GlobalToast';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  activePage: PageId;
  onPageChange: (page: PageId) => void;
  children: ReactNode;
}

export function AppShell({ activePage, onPageChange, children }: AppShellProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    }

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  return (
    <div className="min-h-screen p-3 sm:p-5 lg:p-7">
      <div className="mx-auto grid max-w-[1480px] gap-5 lg:grid-cols-[244px_minmax(0,1fr)]">
        <Sidebar activePage={activePage} onPageChange={onPageChange} />

        <main className="panel min-w-0 overflow-hidden rounded-[2rem] lg:rounded-[2.5rem]">
          <TopBar activePage={activePage} onOpenSearch={() => setIsSearchOpen(true)} />
          <div className="soft-scrollbar px-4 pt-5 pb-28 sm:px-7 sm:pt-7 lg:px-9 lg:pb-9">
            {children}
          </div>
        </main>
      </div>

      <BottomNav activePage={activePage} onPageChange={onPageChange} />
      <CommandPalette
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onPageChange={onPageChange}
      />
      <GlobalToast />
    </div>
  );
}
