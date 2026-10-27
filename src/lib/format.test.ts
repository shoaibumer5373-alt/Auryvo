import { describe, expect, it } from 'vitest';
import { formatDuration, formatRelativeTime, getGreeting } from './format';

describe('format helpers', () => {
  it('formats elapsed time', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(65)).toBe('01:05');
    expect(formatDuration(3725)).toBe('1:02:05');
  });

  it('formats recent timestamps', () => {
    const now = new Date('2026-01-01T12:00:00Z').getTime();
    expect(formatRelativeTime('2026-01-01T11:59:30Z', now)).toBe('Just now');
    expect(formatRelativeTime('2026-01-01T11:55:00Z', now)).toBe('5m ago');
    expect(formatRelativeTime('2026-01-01T09:00:00Z', now)).toBe('3h ago');
  });

  it('returns a time-aware greeting', () => {
    expect(getGreeting(new Date(2026, 0, 1, 9))).toBe('Good morning');
    expect(getGreeting(new Date(2026, 0, 1, 14))).toBe('Good afternoon');
    expect(getGreeting(new Date(2026, 0, 1, 20))).toBe('Good evening');
  });
});
