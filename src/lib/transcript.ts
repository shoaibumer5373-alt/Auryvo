export interface SanitizeOptions {
  allowHindi: boolean;
  romanUrdu: boolean;
}

interface ScriptReplacement {
  urdu: string;
  roman: string;
}

const DEVANAGARI_PATTERN = /[\u0900-\u097F]/;
const DEVANAGARI_GLOBAL_PATTERN = /[\u0900-\u097F]/g;

const COMMON_HINDI_WORDS: Readonly<Record<string, ScriptReplacement>> = {
  है: { urdu: 'ہے', roman: 'hai' },
  हैं: { urdu: 'ہیں', roman: 'hain' },
  और: { urdu: 'اور', roman: 'aur' },
  मैं: { urdu: 'میں', roman: 'main' },
  आप: { urdu: 'آپ', roman: 'aap' },
  यह: { urdu: 'یہ', roman: 'yeh' },
  वह: { urdu: 'وہ', roman: 'woh' },
  नहीं: { urdu: 'نہیں', roman: 'nahin' },
  क्या: { urdu: 'کیا', roman: 'kya' },
  कैसे: { urdu: 'کیسے', roman: 'kaise' },
  क्यों: { urdu: 'کیوں', roman: 'kyun' },
  आज: { urdu: 'آج', roman: 'aaj' },
  कल: { urdu: 'کل', roman: 'kal' },
  अच्छा: { urdu: 'اچھا', roman: 'achha' },
  धन्यवाद: { urdu: 'شکریہ', roman: 'shukriya' },
  नमस्ते: { urdu: 'السلام علیکم', roman: 'Assalam-o-Alaikum' },
};

const FILLER_PATTERN = /\b(um+|uh+|erm+|hmm+|matlab|you know|i mean|basically|actually)\b[, ]*/gi;

export function normalizeWhitespace(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .trim();
}

export function containsDevanagari(value: string): boolean {
  return DEVANAGARI_PATTERN.test(value);
}

export function sanitizeDictation(value: string, options: SanitizeOptions): string {
  if (options.allowHindi) {
    return normalizeWhitespace(value);
  }

  let normalized = value;

  for (const [word, replacement] of Object.entries(COMMON_HINDI_WORDS)) {
    const localizedWord = options.romanUrdu ? replacement.roman : replacement.urdu;
    normalized = normalized.replaceAll(word, localizedWord);
  }

  if (DEVANAGARI_PATTERN.test(normalized)) {
    normalized = normalized.replace(DEVANAGARI_GLOBAL_PATTERN, '');
  }

  return normalizeWhitespace(normalized);
}

export function joinTranscript(...parts: readonly string[]): string {
  return parts.map(normalizeWhitespace).filter(Boolean).join(' ');
}

export function refineTranscriptPreview(value: string, enabled: boolean): string {
  const cleaned = normalizeWhitespace(value);
  if (!enabled || !cleaned) {
    return cleaned;
  }

  const withoutFillers = normalizeWhitespace(cleaned.replace(FILLER_PATTERN, ''));
  const sentences = withoutFillers
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length > 2) {
    return sentences.map((sentence) => `• ${sentence}`).join('\n');
  }

  const withCapital = withoutFillers.charAt(0).toUpperCase() + withoutFillers.slice(1);
  return /[.!?]$/.test(withCapital) ? withCapital : `${withCapital}.`;
}

export function appendPunctuation(value: string, enabled: boolean): string {
  const cleaned = normalizeWhitespace(value);
  if (!enabled || !cleaned || /[.!?]$/.test(cleaned)) {
    return cleaned;
  }

  return `${cleaned}.`;
}
