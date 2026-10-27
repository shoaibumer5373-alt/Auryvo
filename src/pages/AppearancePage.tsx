import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  Check,
  LayoutPanelTop,
  MonitorSmartphone,
  Moon,
  Palette,
  RotateCcw,
  Sparkles,
  Sun,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { SettingRow } from '../components/ui/SettingRow';
import { cn } from '../lib/cn';
import { useAppState } from '../state/useAppState';
import type { AccentName, OverlayPosition, ThemeMode } from '../types/app';

const THEMES: readonly {
  value: ThemeMode;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: 'light',
    label: 'Soft light',
    description: 'Warm paper, pastels, and gentle contrast.',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Midnight',
    description: 'Deep canvas with luminous purple accents.',
    icon: Moon,
  },
];

const ACCENTS: readonly { value: AccentName; label: string; color: string }[] = [
  { value: 'violet', label: 'Royal Violet', color: '#6d48ed' },
  { value: 'tangerine', label: 'Tangerine', color: '#ed8439' },
  { value: 'mint', label: 'Sea Mint', color: '#2a9d8f' },
];

const OVERLAY_POSITIONS: readonly { value: OverlayPosition; label: string }[] = [
  { value: 'bottom', label: 'Bottom' },
  { value: 'top', label: 'Top' },
  { value: 'floating', label: 'Floating' },
];

export function AppearancePage() {
  const { settings, updateSetting, toggleSetting, resetSettings } = useAppState();

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Appearance"
        title="Make it feel like yours."
        description="Soft, focused controls for theme, accent, and the always-available overlay."
        actions={
          <button type="button" onClick={resetSettings} className="pill pill-soft px-4 py-3">
            <RotateCcw className="h-4 w-4" />
            Reset defaults
          </button>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <article className="panel rounded-[2.2rem] p-6 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl accent-surface">
              <Palette className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Theme</h2>
              <p className="muted text-xs">Changes apply across the whole workspace.</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {THEMES.map(({ value, label, description, icon: Icon }) => {
              const isActive = settings.theme === value;

              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => updateSetting('theme', value)}
                  className={cn(
                    'rounded-[1.6rem] border p-4 text-left transition',
                    isActive
                      ? 'accent-border border-2'
                      : 'border-[var(--line)] hover:border-[var(--line-strong)]',
                  )}
                >
                  <div
                    className={cn(
                      'relative mb-4 h-28 overflow-hidden rounded-[1.15rem] p-3',
                      value === 'light' ? 'bg-[#eee9f5]' : 'bg-[#11131b]',
                    )}
                  >
                    <div
                      className={cn(
                        'absolute -top-8 -right-6 h-24 w-24 rounded-full blur-xl',
                        value === 'light' ? 'bg-[#c9b5ff]' : 'bg-[#5c3e9f]',
                      )}
                    />
                    <div
                      className={cn(
                        'relative h-full rounded-xl border p-3',
                        value === 'light'
                          ? 'border-white/70 bg-white/85'
                          : 'border-white/10 bg-[#1b1d27]',
                      )}
                    >
                      <span
                        className={cn(
                          'block h-2 w-12 rounded-full',
                          value === 'light' ? 'bg-[#2b2338]' : 'bg-white/80',
                        )}
                      />
                      <span
                        className={cn(
                          'mt-2 block h-1.5 w-20 rounded-full',
                          value === 'light' ? 'bg-[#d7d0df]' : 'bg-white/20',
                        )}
                      />
                      <span className="mt-4 block h-7 w-7 rounded-full bg-[#a78bfa]" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold">{label}</span>
                    {isActive ? (
                      <Check className="h-4 w-4 accent-text" strokeWidth={2.4} />
                    ) : (
                      <Icon className="h-4 w-4 faint" strokeWidth={1.8} />
                    )}
                  </div>
                  <p className="muted mt-1 text-xs leading-5">{description}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-7">
            <p className="field-label">Accent color</p>
            <div className="flex flex-wrap gap-2.5">
              {ACCENTS.map(({ value, label, color }) => {
                const isActive = settings.accent === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => updateSetting('accent', value)}
                    className={cn(
                      'pill border px-3 py-2.5',
                      isActive
                        ? 'accent-border bg-[var(--accent-soft)]'
                        : 'border-[var(--line)] bg-[var(--panel-soft)]',
                    )}
                  >
                    <span
                      className="h-5 w-5 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    {label}
                    {isActive && <Check className="h-3.5 w-3.5 accent-text" strokeWidth={2.4} />}
                  </button>
                );
              })}
            </div>
          </div>
        </article>

        <article className="panel rounded-[2.2rem] p-6 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl accent-surface">
              <LayoutPanelTop className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Overlay</h2>
              <p className="muted text-xs">Position the compact dictation pill.</p>
            </div>
          </div>

          <SegmentedControl
            label="Overlay position"
            value={settings.overlayPosition}
            options={OVERLAY_POSITIONS}
            onChange={(value) => updateSetting('overlayPosition', value)}
            className="grid w-full grid-cols-3"
          />

          <div className="hero-gradient relative mt-5 h-64 overflow-hidden rounded-[1.7rem] p-4">
            <div className="grain-overlay" />
            <div className="relative flex h-full flex-col items-center justify-center opacity-70">
              <MonitorSmartphone className="h-7 w-7" strokeWidth={1.5} />
              <p className="mt-2 text-xs font-bold">Live overlay preview</p>
            </div>
            <div
              className={cn(
                'absolute left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/60 px-3 py-2 shadow-lg',
                settings.overlayPosition === 'top' && 'top-4',
                settings.overlayPosition === 'bottom' && 'bottom-4',
                settings.overlayPosition === 'floating' && 'top-1/2 -translate-y-1/2',
                settings.glassOverlay ? 'bg-white/35 backdrop-blur-xl' : 'bg-white/90',
              )}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
              <span className="flex h-4 items-end gap-0.5">
                {[7, 12, 9, 15, 8].map((height, index) => (
                  <span
                    key={index}
                    className="w-0.5 rounded-full bg-[#2b2338]/70"
                    style={{ height }}
                  />
                ))}
              </span>
              <span className="text-[0.62rem] font-bold text-[#2b2338]">Listening</span>
            </div>
          </div>

          <div className="mt-4 divide-y divide-[var(--line)]">
            <SettingRow
              icon={Sparkles}
              label="Glass material"
              description="Use blur and translucency on the overlay."
              checked={settings.glassOverlay}
              onChange={() => toggleSetting('glassOverlay')}
            />
            <SettingRow
              icon={Bell}
              label="Status notifications"
              description="Show gentle connection and completion alerts."
              checked={settings.notifications}
              onChange={() => toggleSetting('notifications')}
            />
          </div>
        </article>
      </section>
    </div>
  );
}
