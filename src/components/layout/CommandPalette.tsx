import { CornerDownLeft, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NAVIGATION_ITEMS } from '../../data/navigation';
import type { PageId } from '../../types/app';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onPageChange: (page: PageId) => void;
}

export function CommandPalette({ open, onClose, onPageChange }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    setQuery('');
    inputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const normalizedQuery = query.trim().toLowerCase();
  const results = NAVIGATION_ITEMS.filter((item) =>
    `${item.label} ${item.description}`.toLowerCase().includes(normalizedQuery),
  );

  function selectPage(page: PageId) {
    onPageChange(page);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] p-4 sm:p-8">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-[#171225]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Search Auryvo"
        className="panel relative mx-auto mt-[10vh] w-full max-w-xl overflow-hidden rounded-[2rem]"
      >
        <div className="flex items-center gap-3 border-b border-[var(--line)] px-5 py-4">
          <Search className="h-5 w-5 faint" strokeWidth={1.8} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages and settings…"
            aria-label="Search pages"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="icon-button h-8 w-8"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="soft-scrollbar max-h-96 overflow-y-auto p-3">
          <p className="faint px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.16em]">
            Go to
          </p>
          {results.length > 0 ? (
            results.map(({ id, label, description, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => selectPage(id)}
                className="group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-[var(--panel-soft)]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl accent-surface">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold">{label}</span>
                  <span className="muted block text-xs">{description}</span>
                </span>
                <CornerDownLeft className="h-4 w-4 faint opacity-0 transition group-hover:opacity-100" />
              </button>
            ))
          ) : (
            <p className="muted px-3 py-8 text-center text-sm">No pages match “{query}”.</p>
          )}
        </div>
      </section>
    </div>
  );
}
