'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LocaleProvider, useTranslations } from '@/contexts/LocaleContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const LINKS = [
  { href: '/tools/password-checker', key: 'passwordChecker' as const },
  { href: '/tools/phishing-detector', key: 'phishingDetector' as const },
  { href: '/courses', key: 'courses' as const },
];

function ToolsChromeInner({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <div className="tools-shell">
      <header className="tools-topbar">
        <Link href="/" className="tools-brand">
          Roj<span>Tech</span>
        </Link>
        <nav className="tools-nav" aria-label="Tools">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>
            {t.toolsNav.home}
          </Link>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname?.startsWith(link.href) ? 'active' : ''}
            >
              {t.toolsNav[link.key]}
            </Link>
          ))}
        </nav>
        <div className="tools-topbar-end">
          <LanguageSwitcher />
        </div>
      </header>
      <main className="tools-main">{children}</main>
    </div>
  );
}

export default function ToolsChrome({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <ToolsChromeInner>{children}</ToolsChromeInner>
    </LocaleProvider>
  );
}
