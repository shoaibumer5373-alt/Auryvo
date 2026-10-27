import {
  ArrowRight,
  Clock3,
  Headphones,
  Languages,
  Mic,
  Radio,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { AuraMascot, FocusStar, MoodOrb } from '../components/illustrations/OrganicCharacters';
import { EmptyState } from '../components/ui/EmptyState';
import { Waveform } from '../components/ui/Waveform';
import { ModePills } from '../components/voice/ModePills';
import { RecordButton } from '../components/voice/RecordButton';
import { getLanguage } from '../data/languages';
import { getGreeting, compactNumber, formatDuration, formatRelativeTime } from '../lib/format';
import { getPipelineMode } from '../lib/pipeline';
import { useAppState } from '../state/useAppState';
import type { PageId } from '../types/app';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { settings, session, waveform } = useAppState();
  const currentMode = getPipelineMode(settings);
  const targetLanguage = getLanguage(settings.targetLanguage);

  return (
    <div className="space-y-5">
      <section className="hero-gradient relative min-h-[410px] overflow-hidden rounded-[2.3rem] p-6 text-[#2b2338] sm:min-h-[440px] sm:p-10">
        <div className="grain-overlay" />
        <AuraMascot className="float-slow absolute right-[-22%] bottom-[-12%] h-[54%] opacity-95 sm:right-[-6%] sm:h-[83%] lg:right-[-2%] lg:h-[88%]" />

        <div className="relative z-10 max-w-[78%] sm:max-w-[56%]">
          <span className="pill border-white/40 bg-white/45 px-3 py-2 text-[0.68rem] text-[#4c3774] backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#6d48ed]" />
            Assistant ready
          </span>

          <p className="mt-10 text-sm font-semibold opacity-70 sm:mt-12 dark:text-white/80">
            {getGreeting()},
          </p>
          <h1 className="mt-1 text-[3rem] leading-[0.95] font-bold tracking-[-0.07em] sm:text-[4.4rem] dark:text-white">
            Samantha
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 font-medium opacity-75 sm:text-base dark:text-white/80">
            Speak freely. Auryvo turns your voice into polished text, in the language you need.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('voice')}
              className="pill bg-white px-5 py-3 text-[#2b2338] shadow-lg hover:bg-white/90"
            >
              Start voice typing
              <ArrowRight className="h-4 w-4" />
            </button>
            <span className="pill border-white/35 bg-white/20 px-4 py-3 text-[#2b2338] backdrop-blur-md dark:text-white">
              <Radio className="h-4 w-4" />
              {currentMode.shortLabel} mode
            </span>
          </div>
        </div>

        <div className="absolute bottom-5 left-6 z-20 hidden sm:block">
          <ModePills light />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.28fr_0.86fr_0.82fr]">
        <article className="panel relative flex min-h-[290px] flex-col overflow-hidden rounded-[2rem] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="faint text-[0.65rem] font-bold uppercase tracking-[0.16em]">
                Live dictation
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">
                {session.isRecording ? 'Listening to you' : 'Ready when you are'}
              </h2>
            </div>
            <span className="pill accent-surface px-3 py-2 text-[0.66rem]">
              {formatDuration(session.elapsedSeconds)}
            </span>
          </div>

          <Waveform levels={waveform} active={session.isRecording} className="my-4 h-20" />

          <p className="muted line-clamp-2 min-h-10 flex-1 text-sm leading-6">
            {session.transcript ||
              'Tap the microphone and say what is on your mind. Your words will flow in here.'}
          </p>

          <div className="mt-5 flex items-center gap-4">
            <RecordButton />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">
                {session.isRecording ? 'Recording in progress' : 'Start speaking'}
              </p>
              <p className="muted mt-0.5 text-xs">Works with your selected language and mode.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('voice')}
              className="icon-button"
              aria-label="Open voice typing"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>

        <article className="panel-flat relative flex min-h-[290px] flex-col overflow-hidden rounded-[2rem] p-6">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="faint text-[0.65rem] font-bold uppercase tracking-[0.16em]">
                Your week at a glance
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">In flow</h2>
            </div>
            <span className="pill bg-white px-3 py-2 text-[0.65rem] shadow-sm dark:bg-white/10">
              TOP MOOD
            </span>
          </div>

          <MoodOrb className="float-slow absolute top-[25%] left-[-14%] h-52 w-52 opacity-90" />

          <div className="relative z-10 mt-auto grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[var(--panel)] p-4 shadow-sm">
              <p className="muted text-xs">Words typed</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">{compactNumber(12400)}</p>
            </div>
            <div className="rounded-2xl bg-[var(--panel)] p-4 shadow-sm">
              <p className="muted text-xs">Time saved</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">3.2h</p>
            </div>
          </div>
        </article>

        <button
          type="button"
          onClick={() => onNavigate('remote')}
          className="group relative min-h-[290px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#ffc45f] via-[#f79c4d] to-[#ef7e3c] p-6 text-left text-[#2b2338] shadow-[0_18px_44px_rgba(226,126,57,0.22)]"
        >
          <span className="pill bg-white/85 px-3 py-2 text-[0.66rem]">Remote control</span>
          <FocusStar className="absolute right-[-14%] bottom-[-8%] h-44 w-44 rotate-8 transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute bottom-6 left-6 z-10 max-w-[72%]">
            <h2 className="text-2xl leading-tight font-bold tracking-tight">
              Keep your hands free.
            </h2>
            <p className="mt-2 text-xs leading-5 font-medium opacity-75">
              Use your phone as a mic, trackpad, and keyboard.
            </p>
            <span className="mt-4 grid h-9 w-9 place-items-center rounded-full bg-white/85">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </button>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="panel rounded-[2rem] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="faint text-[0.65rem] font-bold uppercase tracking-[0.16em]">
                Output mode
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">{currentMode.title}</h2>
              <p className="muted mt-2 max-w-lg text-sm leading-6">{currentMode.description}</p>
            </div>
            <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl accent-surface sm:grid">
              <Sparkles className="h-5 w-5" strokeWidth={1.8} />
            </span>
          </div>

          <ModePills className="mt-6" />

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[var(--panel-soft)] p-4">
              <Languages className="h-4 w-4 accent-text" strokeWidth={1.8} />
              <p className="faint mt-4 text-[0.65rem] font-bold uppercase">Target</p>
              <p className="mt-1 text-sm font-bold">{targetLanguage.name}</p>
            </div>
            <div className="rounded-2xl bg-[var(--panel-soft)] p-4">
              <TrendingUp className="h-4 w-4 accent-text" strokeWidth={1.8} />
              <p className="faint mt-4 text-[0.65rem] font-bold uppercase">Accuracy</p>
              <p className="mt-1 text-sm font-bold">98.4%</p>
            </div>
            <div className="rounded-2xl bg-[var(--panel-soft)] p-4">
              <Clock3 className="h-4 w-4 accent-text" strokeWidth={1.8} />
              <p className="faint mt-4 text-[0.65rem] font-bold uppercase">Latency</p>
              <p className="mt-1 text-sm font-bold">0.8 sec</p>
            </div>
          </div>
        </article>

        <article className="panel rounded-[2rem] p-6 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="faint text-[0.65rem] font-bold uppercase tracking-[0.16em]">
                Recent activity
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">Fresh from your voice</h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('voice')}
              className="pill pill-soft px-3 py-2 text-[0.68rem]"
            >
              View all
            </button>
          </div>

          {session.snapshots.length > 0 ? (
            <ul className="space-y-3">
              {session.snapshots.slice(0, 3).map((snapshot) => (
                <li
                  key={snapshot.id}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--panel-soft)] p-4"
                >
                  <p className="line-clamp-2 text-sm leading-6">{snapshot.text}</p>
                  <div className="faint mt-2 flex items-center gap-3 text-[0.68rem] font-semibold">
                    <span>{formatRelativeTime(snapshot.createdAt)}</span>
                    <span>•</span>
                    <span>{formatDuration(snapshot.durationSeconds)}</span>
                    <span>•</span>
                    <span className="uppercase">{snapshot.mode}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Mic}
              title="No dictations yet"
              description="Start a recording and your recent voice notes will appear here."
            />
          )}

          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-[var(--panel-soft)] px-4 py-3 text-xs">
            <Headphones className="h-4 w-4 accent-text" strokeWidth={1.8} />
            <span className="muted">Tip: press</span>
            <kbd className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-2 py-1 font-mono text-[0.68rem] font-bold">
              {settings.hotkey}
            </kbd>
            <span className="muted">to dictate from anywhere.</span>
          </div>
        </article>
      </section>
    </div>
  );
}
