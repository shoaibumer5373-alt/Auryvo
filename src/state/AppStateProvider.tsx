import { useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { DEFAULT_SETTINGS, INITIAL_SESSION, INITIAL_WAVEFORM } from '../data/defaults';
import { getLanguage } from '../data/languages';
import { appendPunctuation, joinTranscript, sanitizeDictation } from '../lib/transcript';
import { getPipelineMode } from '../lib/pipeline';
import {
  getSpeechRecognitionConstructor,
  type SpeechRecognitionLike,
} from '../lib/speechRecognition';
import { readStoredSettings, writeStoredSettings } from '../lib/storage';
import type { AppSettings, BooleanSettingKey, DictationSnapshot } from '../types/app';
import { AppStateContext, type AppStateValue } from './AppStateContext';

const DEMO_TRANSCRIPT =
  'Auryvo is listening. Speak naturally, and your ideas will appear here as clean, ready-to-use text.';

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createSnapshot(text: string, settings: AppSettings, seconds: number): DictationSnapshot {
  const language = settings.translate ? settings.targetLanguage : settings.inputLanguage;

  return {
    id: createId(),
    text,
    createdAt: new Date().toISOString(),
    durationSeconds: seconds,
    mode: getPipelineMode(settings).id,
    language,
  };
}

function getRecognitionErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'not-allowed': 'Microphone access was blocked. Allow it in your browser to use live dictation.',
    'service-not-allowed': 'Speech recognition is unavailable in this browser context.',
    'audio-capture': 'No microphone was found. Connect a microphone and try again.',
    network: 'The speech service is offline. Check your connection and try again.',
    'no-speech': 'No speech was detected. Try speaking a little closer to the microphone.',
  };

  return messages[code] ?? 'Dictation stopped unexpectedly. Please try again.';
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<AppSettings>(readStoredSettings);
  const [session, setSession] = useState(INITIAL_SESSION);
  const [waveform, setWaveform] = useState<number[]>(() => [...INITIAL_WAVEFORM]);

  const settingsRef = useRef(settings);
  const transcriptRef = useRef('');
  const elapsedRef = useRef(0);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const demoTimerRef = useRef<number | null>(null);
  const isRecordingRef = useRef(false);

  settingsRef.current = settings;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', settings.theme === 'dark');
    root.dataset.accent = settings.accent;

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    themeMeta?.setAttribute('content', settings.theme === 'dark' ? '#0d0f15' : '#e8e8f2');
    writeStoredSettings(settings);
  }, [settings]);

  const updateSetting = useCallback(
    <Key extends keyof AppSettings>(key: Key, value: AppSettings[Key]) => {
      setSettings((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const toggleSetting = useCallback((key: BooleanSettingKey) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const setTranscript = useCallback((value: string) => {
    transcriptRef.current = value;
    setSession((current) => ({
      ...current,
      transcript: value,
      interimTranscript: '',
    }));
  }, []);

  const clearTranscript = useCallback(() => {
    transcriptRef.current = '';
    elapsedRef.current = 0;
    setSession((current) => ({
      ...current,
      transcript: '',
      interimTranscript: '',
      elapsedSeconds: 0,
      error: null,
    }));
  }, []);

  const saveTranscript = useCallback(() => {
    const text = transcriptRef.current.trim();
    if (!text) return;

    const snapshot = createSnapshot(text, settingsRef.current, elapsedRef.current);
    setSession((current) => ({
      ...current,
      snapshots: [snapshot, ...current.snapshots].slice(0, 8),
    }));
  }, []);

  const dismissError = useCallback(() => {
    setSession((current) => ({ ...current, error: null }));
  }, []);

  const finalizeRecording = useCallback(() => {
    if (!isRecordingRef.current) return;

    isRecordingRef.current = false;
    const text = transcriptRef.current.trim();
    const snapshot = text ? createSnapshot(text, settingsRef.current, elapsedRef.current) : null;

    setSession((current) => ({
      ...current,
      isRecording: false,
      interimTranscript: '',
      elapsedSeconds: 0,
      snapshots: snapshot ? [snapshot, ...current.snapshots].slice(0, 8) : current.snapshots,
    }));
  }, []);

  const startDemoRecording = useCallback(() => {
    if (isRecordingRef.current) return;

    isRecordingRef.current = true;
    elapsedRef.current = 0;
    recognitionRef.current = null;
    setSession((current) => ({
      ...current,
      isRecording: true,
      isDemoMode: true,
      interimTranscript: '',
      elapsedSeconds: 0,
      error: null,
    }));

    demoTimerRef.current = window.setTimeout(() => {
      const demoText = sanitizeDictation(DEMO_TRANSCRIPT, {
        allowHindi: settingsRef.current.translate && settingsRef.current.targetLanguage === 'hi',
        romanUrdu: settingsRef.current.romanUrdu,
      });
      const nextTranscript = joinTranscript(transcriptRef.current, demoText);
      transcriptRef.current = nextTranscript;
      setSession((current) => ({ ...current, transcript: nextTranscript }));
      finalizeRecording();
    }, 2200);
  }, [finalizeRecording]);

  const startRecording = useCallback(() => {
    if (isRecordingRef.current) return;

    const RecognitionConstructor = getSpeechRecognitionConstructor();
    if (!RecognitionConstructor) {
      startDemoRecording();
      return;
    }

    const recognition = new RecognitionConstructor();
    const currentSettings = settingsRef.current;
    recognition.lang = getLanguage(currentSettings.inputLanguage).speechLang;
    recognition.continuous = true;
    recognition.interimResults = currentSettings.livePreview;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalChunk = '';
      let interimChunk = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const alternative = result?.[0];
        if (!alternative) continue;

        const activeSettings = settingsRef.current;
        const cleaned = sanitizeDictation(alternative.transcript, {
          allowHindi: activeSettings.translate && activeSettings.targetLanguage === 'hi',
          romanUrdu: activeSettings.romanUrdu,
        });

        if (result.isFinal) {
          finalChunk = joinTranscript(
            finalChunk,
            appendPunctuation(cleaned, activeSettings.autoPunctuation),
          );
        } else if (activeSettings.livePreview) {
          interimChunk = joinTranscript(interimChunk, cleaned);
        }
      }

      if (finalChunk) {
        const nextTranscript = joinTranscript(transcriptRef.current, finalChunk);
        transcriptRef.current = nextTranscript;
        setSession((current) => ({
          ...current,
          transcript: nextTranscript,
          interimTranscript: interimChunk,
        }));
      } else {
        setSession((current) => ({ ...current, interimTranscript: interimChunk }));
      }
    };

    recognition.onerror = (event) => {
      setSession((current) => ({
        ...current,
        error: getRecognitionErrorMessage(event.error),
      }));
    };

    recognition.onend = () => {
      finalizeRecording();
    };

    try {
      isRecordingRef.current = true;
      recognition.start();
      recognitionRef.current = recognition;
      elapsedRef.current = 0;
      setSession((current) => ({
        ...current,
        isRecording: true,
        isDemoMode: false,
        interimTranscript: '',
        elapsedSeconds: 0,
        error: null,
      }));
    } catch {
      isRecordingRef.current = false;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      startDemoRecording();
    }
  }, [finalizeRecording, startDemoRecording]);

  const stopRecording = useCallback(() => {
    if (!isRecordingRef.current) return;

    if (demoTimerRef.current !== null) {
      window.clearTimeout(demoTimerRef.current);
      demoTimerRef.current = null;
    }

    const recognition = recognitionRef.current;
    if (!recognition) {
      finalizeRecording();
      return;
    }

    try {
      recognition.stop();
    } catch {
      finalizeRecording();
    }
  }, [finalizeRecording]);

  useEffect(() => {
    if (!session.isRecording) {
      setWaveform([...INITIAL_WAVEFORM]);
      return;
    }

    const timerId = window.setInterval(() => {
      elapsedRef.current += 1;
      setSession((current) => ({ ...current, elapsedSeconds: elapsedRef.current }));
    }, 1000);

    const waveformId = window.setInterval(() => {
      setWaveform((levels) => [...levels.slice(1), 0.12 + Math.random() * 0.88]);
    }, 130);

    return () => {
      window.clearInterval(timerId);
      window.clearInterval(waveformId);
    };
  }, [session.isRecording]);

  useEffect(() => {
    return () => {
      if (demoTimerRef.current !== null) {
        window.clearTimeout(demoTimerRef.current);
      }

      const recognition = recognitionRef.current;
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.abort();
      }
    };
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      settings,
      session,
      waveform,
      updateSetting,
      toggleSetting,
      resetSettings,
      startRecording,
      stopRecording,
      setTranscript,
      clearTranscript,
      saveTranscript,
      dismissError,
    }),
    [
      settings,
      session,
      waveform,
      updateSetting,
      toggleSetting,
      resetSettings,
      startRecording,
      stopRecording,
      setTranscript,
      clearTranscript,
      saveTranscript,
      dismissError,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
