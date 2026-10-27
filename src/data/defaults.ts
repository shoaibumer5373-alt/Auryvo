import type { AppSettings, SessionState } from '../types/app';

export const SETTINGS_STORAGE_KEY = 'auryvo.settings.v1';

export const DEFAULT_SETTINGS: AppSettings = {
  refine: true,
  translate: false,
  romanUrdu: false,
  autoPunctuation: true,
  soundEffects: true,
  glassOverlay: true,
  livePreview: true,
  notifications: true,
  targetLanguage: 'en',
  inputLanguage: 'en',
  transcriptionModel: 'google/gemini-3.5-transcribe',
  refinementModel: 'google/gemini-2.5-flash',
  customPrompt: 'Keep my natural voice. Remove fillers and organize longer thoughts clearly.',
  tone: 'natural',
  theme: 'light',
  accent: 'violet',
  overlayPosition: 'bottom',
  hotkey: 'F8',
};

export const INITIAL_SESSION: SessionState = {
  isRecording: false,
  isDemoMode: false,
  transcript: '',
  interimTranscript: '',
  elapsedSeconds: 0,
  error: null,
  snapshots: [],
};

export const INITIAL_WAVEFORM = [
  0.16, 0.28, 0.42, 0.22, 0.58, 0.72, 0.34, 0.2, 0.46, 0.66, 0.82, 0.38, 0.24, 0.52, 0.76, 0.44,
  0.3, 0.62, 0.88, 0.54, 0.32, 0.2, 0.4, 0.68, 0.5, 0.28, 0.18, 0.36, 0.6, 0.8, 0.42, 0.24,
];
