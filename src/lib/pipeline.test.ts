import { describe, expect, it } from 'vitest';
import { getPipelineMode, getPipelineModeLabel } from './pipeline';

describe('voice pipeline', () => {
  it('resolves all four output combinations', () => {
    expect(getPipelineMode({ refine: false, translate: false }).id).toBe('raw');
    expect(getPipelineMode({ refine: true, translate: false }).id).toBe('refined');
    expect(getPipelineMode({ refine: false, translate: true }).id).toBe('translated');
    expect(getPipelineMode({ refine: true, translate: true }).id).toBe('unified');
  });

  it('returns a compact label for the active mode', () => {
    expect(getPipelineModeLabel({ refine: true, translate: true })).toBe('Unified');
  });
});
