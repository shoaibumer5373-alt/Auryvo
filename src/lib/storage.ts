import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from '../data/defaults';
import type { AccentName, AppSettings, OverlayPosition, ThemeMode, TonePreset } from '../types/app';

const THEME_MODES: readonly ThemeMode[] = ['light', 'dark'];
const ACCENT_NAMES: readonly AccentName[] = ['violet', 'tangerine', 'mint'];
const OVERLAY_POSITIONS: readonly OverlayPosition[] = ['bottom', 'top', 'floating'];
const TONE_PRESETS: readonly TonePreset[] = ['natural', 'professional', 'concise', 'warm'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readSettingsFromRecord(record: Record<string, unknown>): AppSettings {
  const settings: AppSettings = { ...DEFAULT_SETTINGS };

  for (const [key, defaultValue] of Object.entries(DEFAULT_SETTINGS)) {
    const storedValue = record[key];
    if (typeof storedValue === typeof defaultValue) {
      Reflect.set(settings, key, storedValue);
    }
  }

  if (!THEME_MODES.includes(settings.theme)) settings.theme = DEFAULT_SETTINGS.theme;
  if (!ACCENT_NAMES.includes(settings.accent)) settings.accent = DEFAULT_SETTINGS.accent;
  if (!OVERLAY_POSITIONS.includes(settings.overlayPosition)) {
    settings.overlayPosition = DEFAULT_SETTINGS.overlayPosition;
  }
  if (!TONE_PRESETS.includes(settings.tone)) settings.tone = DEFAULT_SETTINGS.tone;

  return settings;
}

export function readStoredSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const rawValue = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!rawValue) return DEFAULT_SETTINGS;

    const parsedValue: unknown = JSON.parse(rawValue);
    return isRecord(parsedValue) ? readSettingsFromRecord(parsedValue) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function writeStoredSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage can be unavailable in private or embedded contexts. The UI still works in memory.
  }
}
