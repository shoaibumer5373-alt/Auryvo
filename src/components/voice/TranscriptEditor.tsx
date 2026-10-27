import { Check, Clock3, Copy, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatDuration } from '../../lib/format';
import { getPipelineMode } from '../../lib/pipeline';
import { useAppState } from '../../state/useAppState';
import { IconButton } from '../ui/IconButton';

interface TranscriptEditorProps {
  className?: string;
}

export function TranscriptEditor({ className }: TranscriptEditorProps) {
  const { session, settings, setTranscript, clearTranscript, saveTranscript } = useAppState();
  const [copied, setCopied] = useState(false);
  const activeMode = getPipelineMode(settings);
  const hasTranscript = session.transcript.trim().length > 0;

  useEffect(() => {
    if (!copied) return;
    const timerId = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timerId);
  }, [copied]);

  async function handleCopy() {
    if (!session.transcript) return;

    try {
      await navigator.clipboard.writeText(session.transcript);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className={`panel rounded-[2rem] p-5 sm:p-6 ${className ?? ''}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight">Live scratchpad</h2>
            <span className="pill accent-surface px-2.5 py-1 text-[0.65rem]">
              {activeMode.shortLabel}
            </span>
          </div>
          <p className="muted mt-1 text-xs">
            Text appears here as you speak. Edit anything before copying.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="pill pill-soft px-3 py-2 font-mono text-xs">
            <Clock3 className="h-3.5 w-3.5" />
            {formatDuration(session.elapsedSeconds)}
          </span>
          <IconButton aria-label="Copy transcript" onClick={handleCopy} disabled={!hasTranscript}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </IconButton>
          <IconButton
            aria-label="Save transcript"
            onClick={saveTranscript}
            disabled={!hasTranscript}
          >
            <Save className="h-4 w-4" />
          </IconButton>
          <IconButton
            aria-label="Clear transcript"
            onClick={clearTranscript}
            disabled={!hasTranscript}
          >
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      <textarea
        value={session.transcript}
        onChange={(event) => setTranscript(event.target.value)}
        placeholder="Your words will appear here. Or type to test the output pipeline…"
        aria-label="Dictation transcript"
        spellCheck
        className="soft-scrollbar h-52 w-full resize-none rounded-[1.5rem] border border-[var(--line)] bg-[var(--panel-soft)] p-5 text-sm leading-7 outline-none transition focus:border-[var(--accent)] sm:text-base"
      />

      <div className="mt-3 flex min-h-7 flex-wrap items-center justify-between gap-2 text-xs">
        <p className="muted italic">
          {session.interimTranscript
            ? `Hearing: “${session.interimTranscript}”`
            : session.isRecording
              ? 'Listening…'
              : session.isDemoMode
                ? 'Preview dictation completed.'
                : 'Ready when you are.'}
        </p>
        <p className="faint">
          {session.transcript.trim().split(/\s+/).filter(Boolean).length} words
        </p>
      </div>
    </section>
  );
}
