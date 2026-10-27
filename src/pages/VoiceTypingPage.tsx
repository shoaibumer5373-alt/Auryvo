import { Keyboard, Languages, Radio, SlidersHorizontal, Trash2, Volume2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { SelectField } from '../components/ui/SelectField';
import { SettingRow } from '../components/ui/SettingRow';
import { Waveform } from '../components/ui/Waveform';
import { ModeCards } from '../components/voice/ModeCards';
import { ModePills } from '../components/voice/ModePills';
import { RecordButton } from '../components/voice/RecordButton';
import { TranscriptEditor } from '../components/voice/TranscriptEditor';
import { LANGUAGES, getLanguage } from '../data/languages';
import { formatDuration, formatRelativeTime } from '../lib/format';
import { getPipelineMode } from '../lib/pipeline';
import { useAppState } from '../state/useAppState';

const LANGUAGE_OPTIONS = LANGUAGES.filter((language) => language.code !== 'ur-Latn').map(
  (language) => ({
    value: language.code,
    label: `${language.name} · ${language.nativeName}`,
  }),
);

const HOTKEY_OPTIONS = [
  { value: 'F8', label: 'F8' },
  { value: 'Ctrl + Space', label: 'Ctrl + Space' },
  { value: 'Alt + R', label: 'Alt + R' },
  { value: 'Ctrl + Shift + M', label: 'Ctrl + Shift + M' },
];

export function VoiceTypingPage() {
  const { settings, session, waveform, updateSetting, toggleSetting, clearTranscript } =
    useAppState();
  const currentMode = getPipelineMode(settings);
  const inputLanguage = getLanguage(settings.inputLanguage);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Voice typing"
        title="Speak. Watch it write."
        description="A calm, live workspace for dictation, cleanup, and instant insertion."
        actions={
          <button type="button" onClick={clearTranscript} className="pill pill-soft px-4 py-3">
            <Trash2 className="h-4 w-4" />
            Clear session
          </button>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.8fr]">
        <article className="hero-gradient relative flex min-h-[390px] flex-col overflow-hidden rounded-[2.2rem] p-6 pb-24 text-[#2b2338] sm:min-h-[430px] sm:p-8 sm:pb-24 lg:pb-8 dark:text-white">
          <div className="grain-overlay" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] opacity-60">
                Microphone
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                {session.isRecording ? 'Auryvo is listening' : 'Your voice, in focus'}
              </h2>
            </div>
            <span className="pill border-white/40 bg-white/35 px-3 py-2 backdrop-blur-md">
              {inputLanguage.nativeName}
            </span>
          </div>

          <Waveform
            levels={waveform}
            active={session.isRecording}
            tone="light"
            className="relative my-auto h-28"
          />

          <div className="relative flex flex-col items-center">
            <RecordButton size="lg" />
            <p className="mt-4 text-sm font-bold">
              {session.isRecording ? 'Tap to finish' : 'Tap to start dictation'}
            </p>
            <p className="mt-1 text-xs opacity-65">
              {session.isRecording
                ? `${formatDuration(session.elapsedSeconds)} · ${currentMode.shortLabel} pipeline`
                : `Or press ${settings.hotkey} from anywhere`}
            </p>
            {session.isDemoMode && (
              <span className="pill mt-3 border-white/35 bg-white/20 px-3 py-1.5 text-[0.62rem]">
                Browser preview mode
              </span>
            )}
          </div>
        </article>

        <aside className="panel rounded-[2.2rem] p-6 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl accent-surface">
              <SlidersHorizontal className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Session settings</h2>
              <p className="muted text-xs">Tune how Auryvo hears you.</p>
            </div>
          </div>

          <div className="space-y-5">
            <SelectField
              label="Spoken language"
              value={settings.inputLanguage}
              onChange={(event) => updateSetting('inputLanguage', event.target.value)}
              options={LANGUAGE_OPTIONS}
            />
            <SelectField
              label="Global hotkey"
              value={settings.hotkey}
              onChange={(event) => updateSetting('hotkey', event.target.value)}
              options={HOTKEY_OPTIONS}
              hint="Desktop app shortcut. Browser preview uses the on-screen mic."
            />

            <div className="divide-y divide-[var(--line)] border-t border-[var(--line)] pt-1">
              <SettingRow
                icon={Languages}
                label="Roman Urdu"
                description="Write spoken Urdu in natural Latin script."
                checked={settings.romanUrdu}
                onChange={() => toggleSetting('romanUrdu')}
              />
              <SettingRow
                icon={Keyboard}
                label="Auto punctuation"
                description="Add natural stops at the end of phrases."
                checked={settings.autoPunctuation}
                onChange={() => toggleSetting('autoPunctuation')}
              />
              <SettingRow
                icon={Radio}
                label="Live preview"
                description="Show interim words while you speak."
                checked={settings.livePreview}
                onChange={() => toggleSetting('livePreview')}
              />
              <SettingRow
                icon={Volume2}
                label="Soft sounds"
                description="Play subtle start and stop tones."
                checked={settings.soundEffects}
                onChange={() => toggleSetting('soundEffects')}
              />
            </div>
          </div>
        </aside>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.8fr]">
        <TranscriptEditor />

        <section className="panel rounded-[2rem] p-6 sm:p-7">
          <div className="mb-5">
            <p className="faint text-[0.65rem] font-bold uppercase tracking-[0.16em]">
              Active pipeline
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">{currentMode.title}</h2>
            <p className="muted mt-2 text-sm leading-6">{currentMode.description}</p>
          </div>

          <ModePills />

          <div className="mt-6 rounded-[1.5rem] bg-[var(--panel-soft)] p-5">
            <p className="text-xs font-bold">Strict script protection</p>
            <p className="muted mt-2 text-xs leading-5">
              Devanagari output is intercepted in dictation modes. Hindi is available only as an
              explicit translation target.
            </p>
          </div>
        </section>
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="faint text-[0.65rem] font-bold uppercase tracking-[0.16em]">
              Four output combinations
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">Choose your flow</h2>
          </div>
          <p className="muted hidden text-xs sm:block">Refine and translate are independent.</p>
        </div>
        <ModeCards />
      </section>

      <section className="panel rounded-[2rem] p-6 sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Session history</h2>
            <p className="muted mt-1 text-xs">Saved locally for this preview session.</p>
          </div>
          <span className="pill pill-soft px-3 py-2 text-[0.66rem]">
            {session.snapshots.length} entries
          </span>
        </div>

        {session.snapshots.length > 0 ? (
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {session.snapshots.map((snapshot) => (
              <li key={snapshot.id} className="rounded-[1.4rem] bg-[var(--panel-soft)] p-4">
                <p className="line-clamp-3 min-h-[3.75rem] text-sm leading-6">{snapshot.text}</p>
                <div className="faint mt-4 flex items-center justify-between text-[0.66rem] font-bold uppercase">
                  <span>{formatRelativeTime(snapshot.createdAt)}</span>
                  <span>
                    {formatDuration(snapshot.durationSeconds)} · {snapshot.language}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-[var(--line-strong)] px-6 py-10 text-center">
            <p className="text-sm font-bold">Your history is clear</p>
            <p className="muted mt-1 text-xs">Completed dictations will be collected here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
