import { describe, expect, it } from 'vitest';
import {
  appendPunctuation,
  containsDevanagari,
  joinTranscript,
  refineTranscriptPreview,
  sanitizeDictation,
} from './transcript';

describe('transcript normalization', () => {
  it('converts known Devanagari words to Urdu script by default', () => {
    const result = sanitizeDictation('मैं आप से और क्या कहूँ', {
      allowHindi: false,
      romanUrdu: false,
    });

    expect(result).toContain('میں');
    expect(result).toContain('آپ');
    expect(result).toContain('اور');
    expect(containsDevanagari(result)).toBe(false);
  });

  it('converts known Devanagari words to Roman Urdu when requested', () => {
    const result = sanitizeDictation('मैं आप से और क्या कहूँ', {
      allowHindi: false,
      romanUrdu: true,
    });

    expect(result).toContain('main');
    expect(result).toContain('aap');
    expect(containsDevanagari(result)).toBe(false);
  });

  it('keeps Devanagari only when Hindi is an explicit translation target', () => {
    const result = sanitizeDictation('मैं ठीक हूँ', {
      allowHindi: true,
      romanUrdu: false,
    });

    expect(containsDevanagari(result)).toBe(true);
  });

  it('removes fillers and adds a final stop', () => {
    expect(refineTranscriptPreview('um, hello world', true)).toBe('Hello world.');
    expect(refineTranscriptPreview('um, hello world', false)).toBe('um, hello world');
  });

  it('joins transcript chunks without duplicate whitespace', () => {
    expect(joinTranscript(' First ', '', ' second. ')).toBe('First second.');
    expect(appendPunctuation(' ready ', true)).toBe('ready.');
    expect(appendPunctuation(' ready? ', true)).toBe('ready?');
  });
});
