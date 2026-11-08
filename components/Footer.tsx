'use client';

import Link from 'next/link';
import { useTranslations } from '@/contexts/LocaleContext';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer>
      <Link href="/" className="footer-logo">
        Roj<span style={{ color: 'var(--green)' }}>Tech</span>
      </Link>
      <div className="footer-copy">{t.footer.copy}</div>
    </footer>
  );
}
