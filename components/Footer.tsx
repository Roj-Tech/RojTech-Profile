'use client';

import { useTranslations } from '@/contexts/LocaleContext';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer>
      <a href="#" className="footer-logo">
        Roj<span style={{ color: 'var(--green)' }}>Tech</span>
      </a>
      <div className="footer-copy">{t.footer.copy}</div>
    </footer>
  );
}
