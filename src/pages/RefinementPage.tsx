import {
  AlignLeft,
  Check,
  Copy,
  ListChecks,
  RotateCcw,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { SelectField } from '../components/ui/SelectField';
import { Toggle } from '../components/ui/Toggle';
import { REFINEMENT_MODELS } from '../data/models';
import { refineTranscriptPreview } from '../lib/transcript';
import { useAppState } from '../state/useAppState';
import type { TonePreset } from '../types/app';

const DEFAULT_SAMPLE =
  'Um, so basically I wanted to say that we should, you know, launch the beta next week. And then collect feedback from the first fifty people. Also fix the onboarding flow because it feels a little confusing.';

const TONE_OPTIONS: readonly { value: TonePreset; label: string }[] = [
  { value: 'natural', label: 'Natural' },
  { value: 'professional', label: 'Pro' },
  { value: 'concise', label: 'Concise' },
  { value: 'warm', label: 'Warm' },
];

const TONE_HINTS: Record<TonePreset, string> = {
  natural: 'Keeps your conversational rhythm.',
  professional: 'Polished language for work documents.',
  concise: 'Removes repetition and shortens sentences.',
  warm: 'Friendly and approachable, never stiff.',
};

const REFINEMENT_MODEL_OPTIONS = REFINEMENT_MODELS.map((model) => ({
  value: model.id,
  label: `${model.name} · ${model.provider}`,
}));

export function RefinementPage() {
  const { settings, session, updateSetting } = useAppState();
  const [sourceText, setSourceText] = useState(DEFAULT_SAMPLE);
  const [copied, setCopied] = useState(false);

  const refinedText = useMemo(() => {
    const base = refineTranscriptPreview(sourceText, settings.refine);
    if (!settings.refine) return base;

    if (settings.tone === 'concise') {
      return base
        .split('\n')
        .map((line) => line.replace(/\b(basically|actually|really|very)\b\s*/gi, ''))
        .join('\n');
    }

    if (settings.tone === 'professional') {
      return base.replace(/\bI wanted to say that\b/gi, 'I propose that');
    }

    return base;
  }, [settings.refine, settings.tone, sourceText]);

  useEffect(() => {
    if (!copied) return;
    const timerId = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timerId);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(refinedText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Refinement"
        title="From raw thoughts to ready text."
        description="Remove hesitation, shape structure, and protect the way you naturally speak."
        actions={
          <span className={`pill px-4 py-3 ${settings.refine ? 'pill-accent' : 'pill-soft'}`}>
            <Sparkles className="h-4 w-4" />
            {settings.refine ? 'Refinement on' : 'Raw output'}
          </span>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
        <article className="panel rounded-[2.2rem] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Refinement engine</h2>
              <p className="muted mt-1 text-xs">Set the structure and voice of your output.</p>
            </div>
            <Toggle
              checked={settings.refine}
              onChange={(checked) => updateSetting('refine', checked)}
              label="Toggle AI refinement"
            />
          </div>

          <div className="mt-7 space-y-6">
            <div>
              <p className="field-label">Writing tone</p>
              <SegmentedControl
                label="Writing tone"
                value={settings.tone}
                options={TONE_OPTIONS}
                onChange={(value) => updateSetting('tone', value)}
                className="grid w-full grid-cols-2 sm:grid-cols-4"
              />
              <p className="faint mt-2 text-xs">{TONE_HINTS[settings.tone]}</p>
            </div>

            <SelectField
              label="Refinement model"
              value={settings.refinementModel}
              onChange={(event) => updateSetting('refinementModel', event.target.value)}
              options={REFINEMENT_MODEL_OPTIONS}
            />

            <div>
              <label className="field-label" htmlFor="custom-prompt">
                Custom instructions
              </label>
              <textarea
                id="custom-prompt"
                value={settings.customPrompt}
                onChange={(event) => updateSetting('customPrompt', event.target.value)}
                rows={5}
                className="soft-scrollbar input-shell resize-none px-4 py-3 text-sm leading-6"
                placeholder="Tell Auryvo how your final text should sound…"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: WandSparkles, label: 'Filler removal' },
                { icon: AlignLeft, label: 'Paragraphs' },
                { icon: ListChecks, label: 'Smart lists' },
                { icon: Sparkles, label: 'Natural tone' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-2xl bg-[var(--panel-soft)] px-3 py-3 text-xs font-bold"
                >
                  <Icon className="h-4 w-4 accent-text" strokeWidth={1.8} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel rounded-[2.2rem] p-6 sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Live preview</h2>
              <p className="muted mt-1 text-xs">Edit the sample to see local cleanup instantly.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSourceText(session.transcript || DEFAULT_SAMPLE)}
                className="icon-button"
                aria-label="Use live transcript"
                title="Use live transcript"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="icon-button"
                aria-label="Copy refined result"
                title="Copy refined result"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--panel-soft)] p-4">
              <p className="faint mb-3 text-[0.65rem] font-bold uppercase tracking-[0.15em]">
                Before
              </p>
              <textarea
                value={sourceText}
                onChange={(event) => setSourceText(event.target.value)}
                aria-label="Raw transcript sample"
                className="soft-scrollbar h-64 w-full resize-none bg-transparent text-sm leading-6 outline-none"
              />
            </div>

            <div className="relative overflow-hidden rounded-[1.5rem] accent-surface p-4">
              <div className="grain-overlay opacity-10" />
              <p className="relative mb-3 text-[0.65rem] font-bold uppercase tracking-[0.15em] opacity-70">
                After · {settings.tone}
              </p>
              <div className="soft-scrollbar relative h-64 overflow-auto whitespace-pre-line pr-2 text-sm leading-6">
                {refinedText || 'Your polished writing will appear here.'}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-[1.4rem] bg-[var(--panel-soft)] px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl accent-surface">
              <ListChecks className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <p className="muted text-xs leading-5">
              Production mode sends this prompt and transcript to your selected AI gateway. This
              preview runs locally so you can evaluate the structure first.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
