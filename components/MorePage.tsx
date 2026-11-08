'use client';

import Link from 'next/link';
import { useTranslations } from '@/contexts/LocaleContext';
import { SlideCorners } from '@/components/icons';
import EmojiGlyph from '@/components/EmojiGlyph';

const MORE_LINKS = [
  { href: '/about', key: 'about' as const, icon: 'ℹ️' },
  { href: '/team', key: 'team' as const, icon: '👥' },
  { href: '/connect', key: 'connect' as const, icon: '📡' },
];

export default function MorePage() {
  const t = useTranslations();

  return (
    <section className="page-section more-page">
      <div className="upcoming-inner">
        <div className="section-header reveal" style={{ textAlign: 'center' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            {t.nav.more}
          </div>
          <h2 className="section-title">
            {t.nav.more}
          </h2>
        </div>

        <div className="more-grid">
          {MORE_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="upcoming-feat-card more-card reveal">
              <SlideCorners prefix="ufc-corner" />
              <div className="ufc-icon">
                <EmojiGlyph>{item.icon}</EmojiGlyph>
              </div>
              <div className="ufc-title">{t.nav[item.key]}</div>
              <span className="ufc-open">{t.common.openTool}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
