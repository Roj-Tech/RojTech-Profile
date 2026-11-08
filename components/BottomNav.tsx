'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CSSProperties } from 'react';
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

/** Inline lock so top-nav / RTL CSS can never rotate this into a side strip on phones */
const BAR_STYLE: CSSProperties = {
  // display is CSS-controlled (hidden on desktop); lock everything else inline
  flexDirection: 'row',
  flexWrap: 'nowrap',
  alignItems: 'stretch',
  justifyContent: 'space-around',
  gap: 0,
  position: 'fixed',
  top: 'auto',
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  maxWidth: '100vw',
  height: 'auto',
  minHeight: 64,
  maxHeight: 88,
  margin: 0,
  zIndex: 1200,
  padding: '6px 4px calc(6px + env(safe-area-inset-bottom, 0px))',
  background: 'rgba(2, 11, 20, 0.98)',
  border: 0,
  borderTop: '1px solid rgba(0, 245, 255, 0.22)',
  borderRadius: 0,
  boxSizing: 'border-box',
  direction: 'ltr',
  writingMode: 'horizontal-tb',
  transform: 'none',
  overflow: 'hidden',
};

const ITEM_STYLE: CSSProperties = {
  flex: '1 1 0',
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  minWidth: 0,
  width: 'auto',
  height: 'auto',
  minHeight: 52,
  margin: 0,
  padding: '6px 2px',
  textDecoration: 'none',
  border: 0,
  borderRadius: 10,
  writingMode: 'horizontal-tb',
  transform: 'none',
  whiteSpace: 'normal',
};

const LABEL_STYLE: CSSProperties = {
  display: 'block',
  fontSize: '0.62rem',
  fontWeight: 600,
  lineHeight: 1.15,
  textAlign: 'center',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  writingMode: 'horizontal-tb',
  transform: 'none',
};

function TabIcon({ name }: { name: string; active: boolean }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
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

  if (pathname.startsWith('/admin')) return null;

  return (
    <div className="bottom-nav" role="navigation" aria-label="Primary" style={BAR_STYLE}>
      {TABS.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`bottom-nav-item${active ? ' active' : ''}${tab.accent ? ' accent' : ''}`}
            aria-current={active ? 'page' : undefined}
            style={ITEM_STYLE}
          >
            <span className="bottom-nav-icon" aria-hidden="true">
              <TabIcon name={tab.icon} active={active} />
            </span>
            <span className="bottom-nav-label" style={LABEL_STYLE}>
              {t.nav[tab.key]}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
