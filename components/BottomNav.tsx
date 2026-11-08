'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/contexts/LocaleContext';

const TABS = [
  { href: '/', key: 'home' as const, icon: 'home', match: (p: string) => p === '/' },
  {
    href: '/tools',
    key: 'tools' as const,
    icon: 'tools',
    match: (p: string) => p === '/tools' || p.startsWith('/tools/'),
  },
  {
    href: '/learn',
    key: 'learn' as const,
    icon: 'learn',
    match: (p: string) => p.startsWith('/learn'),
    accent: true,
  },
  {
    href: '/courses',
    key: 'courses' as const,
    icon: 'courses',
    match: (p: string) => p.startsWith('/courses'),
  },
  {
    href: '/more',
    key: 'more' as const,
    icon: 'more',
    match: (p: string) =>
      p.startsWith('/more') ||
      p.startsWith('/about') ||
      p.startsWith('/team') ||
      p.startsWith('/connect'),
  },
];

function TabIcon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? 'currentColor' : 'currentColor';
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5.5 9.5V21h13V9.5" />
        </svg>
      );
    case 'tools':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.2" />
          <rect x="14" y="3" width="7" height="7" rx="1.2" />
          <rect x="3" y="14" width="7" height="7" rx="1.2" />
          <rect x="14" y="14" width="7" height="7" rx="1.2" />
        </svg>
      );
    case 'learn':
      return (
        <svg {...common}>
          <path d="M4 5.5c2.2-1 4.4-1.5 8-1.5s5.8.5 8 1.5V18c-2.2-1-4.4-1.5-8-1.5s-5.8.5-8 1.5V5.5z" />
          <path d="M12 4v12.5" />
        </svg>
      );
    case 'courses':
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      );
  }
}

export default function BottomNav() {
  const t = useTranslations();
  const pathname = usePathname() || '/';

  // Hide on admin screens
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {TABS.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`bottom-nav-item${active ? ' active' : ''}${tab.accent ? ' accent' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <span className="bottom-nav-icon">
              <TabIcon name={tab.icon} active={active} />
            </span>
            <span className="bottom-nav-label">{t.nav[tab.key]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
