export type PageId =
  'home' | 'voice' | 'refinement' | 'translation' | 'models' | 'appearance' | 'remote';

export type AccentName = 'violet' | 'tangerine' | 'mint';
export type ThemeMode = 'light' | 'dark';
export type OverlayPosition = 'bottom' | 'top' | 'floating';
export type TonePreset = 'natural' | 'professional' | 'concise' | 'warm';

export type BooleanSettingKey =
  | 'refine'
  | 'translate'
  | 'romanUrdu'
  | 'autoPunctuation'
  | 'soundEffects'
  | 'glassOverlay'
  | 'livePreview'
  | 'notifications';

export interface AppSettings {
  refine: boolean;
  translate: boolean;
  romanUrdu: boolean;
  autoPunctuation: boolean;
  soundEffects: boolean;
  glassOverlay: boolean;
  livePreview: boolean;
  notifications: boolean;
  targetLanguage: string;
  inputLanguage: string;
  transcriptionModel: string;
  refinementModel: string;
  customPrompt: string;
  tone: TonePreset;
  theme: ThemeMode;
  accent: AccentName;
  overlayPosition: OverlayPosition;
  hotkey: string;
}

export interface DictationSnapshot {
  id: string;
  text: string;
  createdAt: string;
  durationSeconds: number;
  mode: string;
  language: string;
}

export interface SessionState {
  isRecording: boolean;
  isDemoMode: boolean;
  transcript: string;
  interimTranscript: string;
  elapsedSeconds: number;
  error: string | null;
  snapshots: DictationSnapshot[];
}
