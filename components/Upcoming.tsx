'use client';

import Link from 'next/link';
import { UPCOMING_FEATURES_META } from '@/lib/siteData';
import { SlideCorners } from '@/components/icons';
import { useTranslations } from '@/contexts/LocaleContext';

export default function Upcoming() {
  const t = useTranslations();

  return (
    <section id="upcoming">
      <div className="upcoming-inner">
        <div className="section-header reveal" style={{ textAlign: 'center' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            {t.upcoming.tag}
          </div>
          <h2 className="section-title">
            {t.upcoming.titlePrefix}
            <em>{t.upcoming.titleEm}</em>
          </h2>
        </div>

        <div className="feature-loader-box reveal reveal-delay-1">
          <div className="loader-status">
            <span>{t.common.deploying}</span>
            <span>{t.common.complete}</span>
          </div>
          <div className="loader-bar-wrap">
            <div className="loader-bar-fill loader-bar-fill-complete" />
          </div>

          <div className="upcoming-grid upcoming-grid-three">
            {UPCOMING_FEATURES_META.map((feat) => {
              const content = t.upcoming.features[feat.id];
              return (
                <Link
                  key={feat.tag}
                  href={feat.href}
                  className="upcoming-feat-card"
                >
                  <SlideCorners prefix="ufc-corner" />
                  <div className="ufc-tag">[ {feat.tag} ]</div>
                  <div className="ufc-icon">{feat.icon}</div>
                  <div className="ufc-title">{content.title}</div>
                  <div className="ufc-badge ufc-badge-live">{t.common.live}</div>
                  <span className="ufc-open">{t.common.openTool}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
