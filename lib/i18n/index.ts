import type { Locale, Translations } from './types';
import { en } from './locales/en';
import { ku } from './locales/ku';
import { ar } from './locales/ar';

export type { Locale, Translations } from './types';
export { LOCALES, RTL_LOCALES } from './types';

const dictionaries: Record<Locale, Translations> = { en, ku, ar };

export function getTranslations(locale: Locale): Translations {
  return dictionaries[locale] ?? en;
}

export function isRtlLocale(locale: Locale): boolean {
  return locale === 'ku' || locale === 'ar';
}

export const LOCALE_STORAGE_KEY = 'rojtech-locale';

export function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === 'en' || stored === 'ku' || stored === 'ar') return stored;
  return null;
}
