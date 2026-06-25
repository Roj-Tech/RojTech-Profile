'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from '@/contexts/LocaleContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const NAV_HREFS = [
  { href: '#about', key: 'about' as const },
  { href: '#team', key: 'team' as const },
  { href: '#skills', key: 'learn' as const },
  { href: '#cta', key: 'connect' as const },
];

export default function Nav() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      <a href="#" className="nav-logo">
        Roj<span>Tech</span>
      </a>
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
          {NAV_HREFS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)}>
                {t.nav[link.key]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
