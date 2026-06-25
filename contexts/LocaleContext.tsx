'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getStoredLocale,
  getTranslations,
  isRtlLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
  type Translations,
} from '@/lib/i18n';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
  dir: 'ltr' | 'rtl';
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getStoredLocale();
    if (stored) setLocaleState(stored);
    setReady(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }, []);

  const t = useMemo(() => getTranslations(locale), [locale]);
  const dir: 'ltr' | 'rtl' = isRtlLocale(locale) ? 'rtl' : 'ltr';

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.body.classList.remove('locale-en', 'locale-ku', 'locale-ar');
    document.body.classList.add(`locale-${locale}`);
    document.title = t.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t.meta.description);
  }, [locale, dir, t, ready]);

  const value = useMemo(() => ({ locale, setLocale, t, dir }), [locale, setLocale, t, dir]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

export function useTranslations() {
  return useLocale().t;
}
