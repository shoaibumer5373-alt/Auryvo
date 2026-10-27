import { ArrowRight, Check, Globe2, Languages, Search, ShieldCheck, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { SettingRow } from '../components/ui/SettingRow';
import { LANGUAGES, getLanguage } from '../data/languages';
import { cn } from '../lib/cn';
import { useAppState } from '../state/useAppState';

export function TranslationPage() {
  const { settings, updateSetting, toggleSetting } = useAppState();
  const [query, setQuery] = useState('');
  const selectedLanguage = getLanguage(settings.targetLanguage);

  const filteredLanguages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return LANGUAGES;

    return LANGUAGES.filter((language) =>
      `${language.name} ${language.nativeName} ${language.region}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Translation"
        title="Speak yours. Write theirs."
        description="Choose a target language and let Auryvo preserve meaning, tone, and natural rhythm."
        actions={
          <button
            type="button"
            onClick={() => toggleSetting('translate')}
            className={cn('pill px-4 py-3', settings.translate ? 'pill-accent' : 'pill-soft')}
          >
            <Languages className="h-4 w-4" />
            {settings.translate ? 'Translation on' : 'Translation off'}
          </button>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.8fr]">
        <article className="panel rounded-[2.2rem] p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Target language</h2>
              <p className="muted mt-1 text-xs">Pick where your words should land.</p>
            </div>
            <label className="relative block w-full sm:w-72">
              <span className="sr-only">Search languages</span>
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search languages…"
                className="input-shell py-3 pr-4 pl-11 text-sm"
              />
            </label>
          </div>

          <div className="mt-6">
            <p className="faint mb-3 text-[0.65rem] font-bold uppercase tracking-[0.15em]">
              Favorites
            </p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.filter((language) => language.favorite).map((language) => {
                const isSelected = settings.targetLanguage === language.code;
                return (
                  <button
                    key={language.code}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => updateSetting('targetLanguage', language.code)}
                    className={cn('pill px-4 py-2.5', isSelected ? 'pill-accent' : 'pill-soft')}
                  >
                    <Star className="h-3.5 w-3.5" />
                    {language.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLanguages.map((language) => {
              const isSelected = settings.targetLanguage === language.code;
              const isHindi = language.code === 'hi';

              return (
                <button
                  key={language.code}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => updateSetting('targetLanguage', language.code)}
                  className={cn(
                    'panel-hover group relative overflow-hidden rounded-[1.5rem] border p-4 text-left',
                    isSelected
                      ? 'accent-border border-2 accent-surface'
                      : 'border-[var(--line)] bg-[var(--panel-soft)]',
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--panel-strong)] text-[0.62rem] font-extrabold">
                      {language.symbol}
                    </span>
                    {isSelected && (
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--accent)] text-white">
                        <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                      </span>
                    )}
                  </div>
                  <p className="mt-5 text-sm font-bold">{language.name}</p>
                  <p className="muted mt-0.5 text-xs">{language.nativeName}</p>
                  {isHindi && (
                    <p className="faint mt-2 text-[0.62rem] font-bold uppercase">
                      Translation only
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <p className="muted py-10 text-center text-sm">No languages match “{query}”.</p>
          )}
        </article>

        <div className="space-y-5">
          <article className="hero-gradient relative overflow-hidden rounded-[2.2rem] p-6 text-[#2b2338] sm:p-7 dark:text-white">
            <div className="grain-overlay" />
            <div className="relative">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/40 backdrop-blur-md">
                <Globe2 className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <p className="mt-8 text-[0.65rem] font-bold uppercase tracking-[0.16em] opacity-60">
                Current flow
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="pill bg-white/55 px-4 py-2.5 text-[#2b2338]">
                  {getLanguage(settings.inputLanguage).name}
                </span>
                <ArrowRight className="h-4 w-4 opacity-60" />
                <span className="pill bg-white px-4 py-2.5 text-[#2b2338]">
                  {selectedLanguage.name}
                </span>
              </div>
              <p className="mt-5 text-sm leading-6 opacity-70">
                {settings.translate
                  ? `Auryvo will write naturally in ${selectedLanguage.nativeName}.`
                  : 'Turn on translation to activate this language flow.'}
              </p>
            </div>
          </article>

          <article className="panel rounded-[2.2rem] p-6 sm:p-7">
            <h2 className="text-lg font-bold tracking-tight">Script rules</h2>
            <div className="mt-4 divide-y divide-[var(--line)]">
              <SettingRow
                icon={Languages}
                label="Roman Urdu output"
                description="Use Latin script for Urdu without English translation."
                checked={settings.romanUrdu}
                onChange={() => toggleSetting('romanUrdu')}
              />
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-[1.4rem] bg-[var(--panel-soft)] p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 accent-text" strokeWidth={1.8} />
              <p className="muted text-xs leading-5">
                Hindi is allowed only as a target language when translation is explicitly on.
                Devanagari is never emitted during ordinary dictation.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
