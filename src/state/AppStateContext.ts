import { createContext } from 'react';
import type { AppSettings, BooleanSettingKey, SessionState } from '../types/app';

export interface AppStateValue {
  settings: AppSettings;
  session: SessionState;
  waveform: number[];
  updateSetting: <Key extends keyof AppSettings>(key: Key, value: AppSettings[Key]) => void;
  toggleSetting: (key: BooleanSettingKey) => void;
  resetSettings: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  setTranscript: (value: string) => void;
  clearTranscript: () => void;
  saveTranscript: () => void;
  dismissError: () => void;
}

export const AppStateContext = createContext<AppStateValue | null>(null);
