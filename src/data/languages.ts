export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  symbol: string;
  speechLang: string;
  favorite: boolean;
}

export const LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Global',
    symbol: 'EN',
    speechLang: 'en-US',
    favorite: true,
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    region: 'Pakistan',
    symbol: 'UR',
    speechLang: 'ur-PK',
    favorite: true,
  },
  {
    code: 'ur-Latn',
    name: 'Roman Urdu',
    nativeName: 'Roman Urdu',
    region: 'Pakistan',
    symbol: 'RU',
    speechLang: 'ur-PK',
    favorite: true,
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    region: 'Middle East',
    symbol: 'AR',
    speechLang: 'ar-SA',
    favorite: false,
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'India',
    symbol: 'HI',
    speechLang: 'hi-IN',
    favorite: false,
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    region: 'Spain & Americas',
    symbol: 'ES',
    speechLang: 'es-ES',
    favorite: false,
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    region: 'France',
    symbol: 'FR',
    speechLang: 'fr-FR',
    favorite: false,
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    region: 'DACH',
    symbol: 'DE',
    speechLang: 'de-DE',
    favorite: false,
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    region: 'China',
    symbol: 'ZH',
    speechLang: 'zh-CN',
    favorite: false,
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    region: 'Japan',
    symbol: 'JA',
    speechLang: 'ja-JP',
    favorite: false,
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    region: 'Türkiye',
    symbol: 'TR',
    speechLang: 'tr-TR',
    favorite: false,
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    region: 'Portugal & Brazil',
    symbol: 'PT',
    speechLang: 'pt-PT',
    favorite: false,
  },
] as const satisfies readonly LanguageOption[];

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

export function getLanguage(code: string): LanguageOption {
  return LANGUAGES.find((language) => language.code === code) ?? LANGUAGES[0];
}
