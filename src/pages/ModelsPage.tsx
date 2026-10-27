import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Boxes,
  CheckCircle2,
  Cloud,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { REFINEMENT_MODELS, TRANSCRIPTION_MODELS } from '../data/models';
import { cn } from '../lib/cn';
import { useAppState } from '../state/useAppState';

type ProviderId = 'vercel' | 'openrouter';

interface ProviderFormState {
  key: string;
  showKey: boolean;
  saved: boolean;
}

const PROVIDERS: readonly {
  id: ProviderId;
  name: string;
  endpoint: string;
  description: string;
  icon: LucideIcon;
  tint: string;
}[] = [
  {
    id: 'vercel',
    name: 'Vercel AI Gateway',
    endpoint: 'ai-gateway.vercel.sh/v4/ai',
    description: 'Primary transcription and fast refinement.',
    icon: Zap,
    tint: 'from-[#8a63ee] to-[#b79cfb]',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    endpoint: 'openrouter.ai/api/v1',
    description: 'Fallback speech and heavy document models.',
    icon: Cloud,
    tint: 'from-[#f3a35b] to-[#f8cc7e]',
  },
];

const INITIAL_PROVIDERS: Record<ProviderId, ProviderFormState> = {
  vercel: { key: '', showKey: false, saved: false },
  openrouter: { key: '', showKey: false, saved: false },
};

export function ModelsPage() {
  const { settings, updateSetting } = useAppState();
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);

  function updateProvider(id: ProviderId, patch: Partial<ProviderFormState>) {
    setProviders((current) => ({
      ...current,
      [id]: { ...current[id], ...patch },
    }));
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Models"
        title="Your AI, your keys."
        description="Connect two gateways and choose the right model for speech and writing."
        actions={
          <span className="pill pill-soft px-4 py-3">
            <Boxes className="h-4 w-4" />2 gateways
          </span>
        }
      />

      <section className="grid gap-5 lg:grid-cols-2">
        {PROVIDERS.map(({ id, name, endpoint, description, icon: Icon, tint }) => {
          const provider = providers[id];

          return (
            <article key={id} className="panel overflow-hidden rounded-[2.2rem]">
              <div className={cn('relative bg-gradient-to-br p-6 text-white', tint)}>
                <div className="grain-overlay" />
                <div className="relative flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20 backdrop-blur-md">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span
                    className={cn(
                      'pill px-3 py-2 text-[0.64rem]',
                      provider.saved ? 'bg-white text-[#2b2338]' : 'bg-white/20 text-white',
                    )}
                  >
                    {provider.saved ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                    {provider.saved ? 'Key saved locally' : 'Not connected'}
                  </span>
                </div>
                <h2 className="relative mt-6 text-xl font-bold tracking-tight">{name}</h2>
                <p className="relative mt-1 text-xs text-white/80">{description}</p>
              </div>

              <div className="p-6">
                <label className="field-label" htmlFor={`${id}-key`}>
                  API key
                </label>
                <div className="relative">
                  <KeyRound className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
                  <input
                    id={`${id}-key`}
                    type={provider.showKey ? 'text' : 'password'}
                    value={provider.key}
                    onChange={(event) =>
                      updateProvider(id, { key: event.target.value, saved: false })
                    }
                    placeholder={id === 'vercel' ? 'AI Gateway key…' : 'OpenRouter key…'}
                    autoComplete="off"
                    className="input-shell py-3 pr-12 pl-11 text-sm"
                  />
                  <button
                    type="button"
                    aria-label={provider.showKey ? 'Hide API key' : 'Show API key'}
                    onClick={() => updateProvider(id, { showKey: !provider.showKey })}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-tertiary)] transition hover:text-[var(--accent)]"
                  >
                    {provider.showKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <code className="faint truncate text-[0.68rem]">{endpoint}</code>
                  <button
                    type="button"
                    disabled={!provider.key.trim()}
                    onClick={() => updateProvider(id, { saved: true, showKey: false })}
                    className="pill pill-accent px-4 py-2.5 disabled:opacity-40"
                  >
                    {provider.saved ? 'Saved' : 'Save key'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr_0.62fr]">
        <ModelList
          eyebrow="Speech to text"
          title="Transcription model"
          icon={Activity}
          models={TRANSCRIPTION_MODELS}
          value={settings.transcriptionModel}
          onChange={(value) => updateSetting('transcriptionModel', value)}
        />
        <ModelList
          eyebrow="Writing engine"
          title="Refinement model"
          icon={Sparkles}
          models={REFINEMENT_MODELS}
          value={settings.refinementModel}
          onChange={(value) => updateSetting('refinementModel', value)}
        />

        <article className="panel-flat rounded-[2rem] p-6">
          <span className="grid h-11 w-11 place-items-center rounded-2xl accent-surface">
            <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <h2 className="mt-5 text-lg font-bold tracking-tight">Gateway health</h2>
          <div className="mt-5 space-y-4">
            {[
              { label: 'Primary route', value: 'Ready', color: 'bg-[#55c79e]' },
              { label: 'Fallback route', value: 'Standby', color: 'bg-[#f4b45f]' },
              { label: 'Median latency', value: '0.8s', color: 'bg-[var(--accent)]' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3">
                <span className="muted text-xs">{item.label}</span>
                <span className="flex items-center gap-2 text-xs font-bold">
                  <span className={cn('h-2 w-2 rounded-full', item.color)} />
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <p className="muted mt-6 border-t border-[var(--line)] pt-5 text-xs leading-5">
            This interface stores keys only in React state for the current session. No model
            requests are sent from this UI preview.
          </p>
        </article>
      </section>
    </div>
  );
}

interface ModelListProps {
  eyebrow: string;
  title: string;
  icon: LucideIcon;
  models: readonly {
    id: string;
    name: string;
    provider: string;
    description: string;
    badge?: string;
  }[];
  value: string;
  onChange: (value: string) => void;
}

function ModelList({ eyebrow, title, icon: Icon, models, value, onChange }: ModelListProps) {
  return (
    <article className="panel rounded-[2rem] p-6 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl accent-surface">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </span>
        <div>
          <p className="faint text-[0.65rem] font-bold uppercase tracking-[0.15em]">{eyebrow}</p>
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        </div>
      </div>

      <div className="space-y-2.5">
        {models.map((model) => {
          const isActive = model.id === value;

          return (
            <button
              key={model.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(model.id)}
              className={cn(
                'w-full rounded-[1.4rem] border p-4 text-left transition',
                isActive
                  ? 'accent-border border-2 accent-surface'
                  : 'border-[var(--line)] bg-[var(--panel-soft)] hover:border-[var(--line-strong)]',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold">{model.name}</p>
                {model.badge && (
                  <span className="pill bg-white/70 px-2.5 py-1 text-[0.58rem] text-[#2b2338]">
                    {model.badge}
                  </span>
                )}
              </div>
              <p className="faint mt-1 text-[0.66rem] font-semibold uppercase">{model.provider}</p>
              <p className="muted mt-2 text-xs leading-5">{model.description}</p>
            </button>
          );
        })}
      </div>
    </article>
  );
}
