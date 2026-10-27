import { useEffect, useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { NAVIGATION_ITEMS } from './data/navigation';
import { AppearancePage } from './pages/AppearancePage';
import { HomePage } from './pages/HomePage';
import { ModelsPage } from './pages/ModelsPage';
import { RefinementPage } from './pages/RefinementPage';
import { RemoteControlPage } from './pages/RemoteControlPage';
import { TranslationPage } from './pages/TranslationPage';
import { VoiceTypingPage } from './pages/VoiceTypingPage';
import { AppStateProvider } from './state/AppStateProvider';
import type { PageId } from './types/app';

const PAGE_IDS = new Set<string>(NAVIGATION_ITEMS.map((item) => item.id));

function readInitialPage(): PageId {
  const hash = window.location.hash.slice(1);
  return PAGE_IDS.has(hash) ? (hash as PageId) : 'home';
}

interface PageRouterProps {
  page: PageId;
  onNavigate: (page: PageId) => void;
}

function PageRouter({ page, onNavigate }: PageRouterProps) {
  switch (page) {
    case 'home':
      return <HomePage onNavigate={onNavigate} />;
    case 'voice':
      return <VoiceTypingPage />;
    case 'refinement':
      return <RefinementPage />;
    case 'translation':
      return <TranslationPage />;
    case 'models':
      return <ModelsPage />;
    case 'appearance':
      return <AppearancePage />;
    case 'remote':
      return <RemoteControlPage />;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(readInitialPage);

  useEffect(() => {
    if (window.location.protocol === 'file:') return;
    window.history.replaceState(null, '', `${window.location.pathname}#${activePage}`);
  }, [activePage]);

  useEffect(() => {
    function handleHashChange() {
      setActivePage(readInitialPage());
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <AppStateProvider>
      <AppShell activePage={activePage} onPageChange={setActivePage}>
        <PageRouter page={activePage} onNavigate={setActivePage} />
      </AppShell>
    </AppStateProvider>
  );
}
