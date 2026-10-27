export type PipelineModeId = 'raw' | 'refined' | 'translated' | 'unified';

export interface PipelineFlags {
  refine: boolean;
  translate: boolean;
}

export interface PipelineMode extends PipelineFlags {
  id: PipelineModeId;
  combination: 1 | 2 | 3 | 4;
  title: string;
  shortLabel: string;
  description: string;
}

export const PIPELINE_MODES: readonly PipelineMode[] = [
  {
    id: 'raw',
    combination: 1,
    refine: false,
    translate: false,
    title: 'Raw ASR dictation',
    shortLabel: 'Raw',
    description: 'Your exact words, punctuated and typed instantly.',
  },
  {
    id: 'refined',
    combination: 2,
    refine: true,
    translate: false,
    title: 'Professional refinement',
    shortLabel: 'Refined',
    description: 'Fillers removed and ideas shaped into clean paragraphs.',
  },
  {
    id: 'translated',
    combination: 3,
    refine: false,
    translate: true,
    title: 'Direct translation',
    shortLabel: 'Translated',
    description: 'Natural meaning in your target language, without extra structure.',
  },
  {
    id: 'unified',
    combination: 4,
    refine: true,
    translate: true,
    title: 'Unified refinement + translation',
    shortLabel: 'Unified',
    description: 'Executive-ready writing, translated in one fluid pass.',
  },
] as const;

export function getPipelineMode({ refine, translate }: PipelineFlags): PipelineMode {
  const mode = PIPELINE_MODES.find(
    (candidate) => candidate.refine === refine && candidate.translate === translate,
  );

  if (!mode) {
    throw new Error('Unable to resolve the current voice pipeline.');
  }

  return mode;
}

export function getPipelineModeLabel({ refine, translate }: PipelineFlags): string {
  return getPipelineMode({ refine, translate }).shortLabel;
}
