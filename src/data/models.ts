export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  description: string;
  badge?: string;
}

export const TRANSCRIPTION_MODELS: readonly ModelOption[] = [
  {
    id: 'google/gemini-3.5-transcribe',
    name: 'Gemini 3.5 Transcribe',
    provider: 'Vercel AI Gateway',
    description: 'Low-latency multilingual speech with Urdu-aware prompting.',
    badge: 'Fastest',
  },
  {
    id: 'openai/whisper-1',
    name: 'Whisper 1',
    provider: 'OpenRouter',
    description: 'Reliable general-purpose transcription fallback.',
  },
  {
    id: 'openai/whisper-large-v3',
    name: 'Whisper Large V3',
    provider: 'OpenRouter',
    description: 'Higher accuracy for noisy, mixed-language conversations.',
  },
];

export const REFINEMENT_MODELS: readonly ModelOption[] = [
  {
    id: 'google/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Vercel AI Gateway',
    description: 'Best balance of speed, structure, and multilingual nuance.',
    badge: 'Recommended',
  },
  {
    id: 'google/gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Vercel AI Gateway',
    description: 'Fast everyday cleanup and rewriting.',
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenRouter',
    description: 'Crisp business writing with dependable formatting.',
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'OpenRouter',
    description: 'Long-form structure and nuanced document refinement.',
  },
];

export function getModelName(modelId: string): string {
  const allModels = [...TRANSCRIPTION_MODELS, ...REFINEMENT_MODELS];
  return allModels.find((model) => model.id === modelId)?.name ?? modelId;
}
