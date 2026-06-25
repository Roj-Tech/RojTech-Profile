'use client';

import { useCallback, useEffect, useState } from 'react';
import { UPCOMING_FEATURES_META } from '@/lib/siteData';
import { SlideCorners } from '@/components/icons';
import { useTranslations } from '@/contexts/LocaleContext';

type ActiveFeature = {
  icon: string;
  tag: string;
  feature: string;
};

export default function Upcoming() {
  const t = useTranslations();
  const [active, setActive] = useState<ActiveFeature | null>(null);

  const closeModal = useCallback(() => {
    setActive(null);
    document.body.style.overflow = '';
  }, []);

  const openModal = useCallback((icon: string, tag: string, feature: string) => {
    setActive({ icon, tag, feature });
    document.body.style.overflow = 'hidden';
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && active) closeModal();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active, closeModal]);

  return (
    <>
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
            <div className="coming-soon-badge">{t.common.comingSoon}</div>
          </div>

          <div className="feature-loader-box reveal reveal-delay-1">
            <div className="loader-status">
              <span>{t.common.deploying}</span>
              <span>{t.common.complete}</span>
            </div>
            <div className="loader-bar-wrap">
              <div className="loader-bar-fill" />
            </div>

            <div className="upcoming-grid">
              {UPCOMING_FEATURES_META.map((feat) => {
                const content = t.upcoming.features[feat.id];
                return (
                  <div
                    key={feat.tag}
                    className={`upcoming-feat-card${feat.className ? ` ${feat.className}` : ''}`}
                    onClick={() => openModal(feat.icon, feat.tag, content.feature)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openModal(feat.icon, feat.tag, content.feature);
                      }
                    }}
                  >
                    <SlideCorners prefix="ufc-corner" />
                    <div className="ufc-tag">[ {feat.tag} ]</div>
                    <div className="ufc-icon">{feat.icon}</div>
                    <div className="ufc-title">{content.title}</div>
                    <div className="ufc-badge">{t.common.comingSoon}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div
        className={`feat-modal-overlay${active ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="featModalTitle"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className="feat-modal">
          <SlideCorners prefix="feat-modal-corner" />
          <button className="feat-modal-close" aria-label={t.common.close} onClick={closeModal}>
            ✕
          </button>
          {active && (
            <>
              <div className="feat-modal-icon">{active.icon}</div>
              <div className="feat-modal-tag">[ {active.tag} ]</div>
              <h3 className="feat-modal-title" id="featModalTitle">
                {active.feature}
              </h3>
              <div className="feat-modal-divider" />
              <p className="feat-modal-msg">{t.common.featModalMsg}</p>
              <div className="feat-modal-pulse" />
            </>
          )}
        </div>
      </div>
    </>
  );
}
