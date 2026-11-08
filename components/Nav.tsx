'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from '@/contexts/LocaleContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const NAV_LINKS = [
  { href: '/', key: 'home' as const },
  { href: '/about', key: 'about' as const },
  { href: '/team', key: 'team' as const },
  { href: '/learn', key: 'learn' as const },
  { href: '/tools', key: 'tools' as const },
  { href: '/courses', key: 'courses' as const },
  { href: '/connect', key: 'connect' as const },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Nav() {
  const t = useTranslations();
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return;
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 768) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('click', onDocClick);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <nav>
      <Link href="/" className="nav-logo">
        Roj<span>Tech</span>
      </Link>
      <div className="nav-menu" ref={menuRef}>
        <LanguageSwitcher />
        <button
          className={`nav-toggle${open ? ' open' : ''}`}
          type="button"
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={open}
          aria-controls="navLinks"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
        >
          <span />
          <span />
          <span />
        </button>
        <ul className={`nav-links${open ? ' open' : ''}`} id="navLinks">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={isActive(pathname, link.href) ? 'active' : undefined}
                onClick={() => setOpen(false)}
              >
                {t.nav[link.key]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
