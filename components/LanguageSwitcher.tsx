'use client';

import { LOCALES, type Locale } from '@/lib/i18n';
import { useLocale } from '@/contexts/LocaleContext';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="lang-switcher" role="group" aria-label={t.lang.label}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-btn${locale === code ? ' active' : ''}`}
          aria-pressed={locale === code}
          onClick={() => setLocale(code)}
        >
          {t.lang[code]}
        </button>
      ))}
    </div>
  );
}
