'use client';

import Link from 'next/link';
import { COURSES_HOME_META } from '@/lib/siteData';
import { SlideCorners } from '@/components/icons';
import EmojiGlyph from '@/components/EmojiGlyph';
import { useTranslations } from '@/contexts/LocaleContext';

export default function CoursesHomeSection() {
  const t = useTranslations();
  const feat = COURSES_HOME_META;
  const content = t.coursesHome;

  return (
    <section id="courses-home">
      <div className="upcoming-inner">
        <div className="section-header reveal" style={{ textAlign: 'center' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            {content.tag}
          </div>
          <h2 className="section-title">
            {content.titlePrefix}
            <em>{content.titleEm}</em>
          </h2>
          <p className="learn-hint">{content.lead}</p>
        </div>

        <div className="feature-loader-box courses-home-box reveal reveal-delay-1">
          <div className="loader-status">
            <span>{content.statusLeft}</span>
            <span>{content.statusRight}</span>
          </div>
          <div className="loader-bar-wrap">
            <div className="loader-bar-fill loader-bar-fill-complete" />
          </div>

          <div className="courses-home-grid">
            <Link href={feat.href} className="upcoming-feat-card courses-home-card">
              <SlideCorners prefix="ufc-corner" />
              <div className="ufc-tag">[ {feat.tag} ]</div>
              <div className="ufc-icon">
                <EmojiGlyph>{feat.icon}</EmojiGlyph>
              </div>
              <div className="ufc-title">{content.cardTitle}</div>
              <p className="courses-home-desc">{content.cardDesc}</p>
              <div className="ufc-badge ufc-badge-live">{t.common.live}</div>
              <span className="ufc-open">{content.openLibrary}</span>
            </Link>
          </div>
          <p className="learn-hint" style={{ marginTop: 18 }}>
            <a className="ufc-open" href="/book-viewer.html?id=java-kurdish-rojtech">
              Open Java Kurdish book (phone reader) →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
