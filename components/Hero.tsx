'use client';

import { FEATURE_SLIDES_META } from '@/lib/siteData';
import { useSlider } from '@/hooks/useSlider';
import { ChevronNext, ChevronPrev, SlideCorners } from '@/components/icons';
import MatrixRain from '@/components/MatrixRain';
import { useHeroReveal } from '@/hooks/useScrollReveal';
import { useTranslations } from '@/contexts/LocaleContext';

export default function Hero() {
  const t = useTranslations();
  useHeroReveal();

  const { current, goTo, trackRef, boxRef, resetAuto } = useSlider({
    total: FEATURE_SLIDES_META.length,
    autoInterval: 2500,
    onBoxClick: () => {
      document.getElementById('upcoming')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    dotClass: 'dot',
  });

  return (
    <section id="hero">
      <MatrixRain />
      <div className="matrix-blur-overlay" />
      <div className="grid-bg" />
      <div className="scanline" />
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      <div className="hero-content">
        <div className="hero-logo-wrap reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/LOGO44.png" alt={t.hero.logoAlt} className="hero-logo-img" />
        </div>
        <div className="hero-cta reveal reveal-delay-1">
          <a href="#cta" className="btn-primary">
            {t.hero.joinCommunity}
          </a>
          <a href="#team" className="btn-secondary">
            {t.hero.meetTeam}
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="features-slider-wrap">
          <div className="features-slider-label">
            <span className="features-blink-dot" />
            {t.hero.featuresLabel}
          </div>
          <div
            className="features-slider-box"
            ref={boxRef}
            style={{ '--slider-box-label': `"${t.common.sliderBoxLabel}"` } as React.CSSProperties}
          >
            <div className="features-slider-viewport">
              <div className="features-slider-track" ref={trackRef}>
                {FEATURE_SLIDES_META.map((slide) => {
                  const content = t.features[slide.id];
                  return (
                    <div className="feature-slide" key={slide.tag}>
                      <SlideCorners prefix="feature-slide-corner" />
                      <div className="feature-slide-tag">[ {slide.tag} ]</div>
                      <div className="feature-slide-icon">{slide.icon}</div>
                      <div className="feature-slide-title">
                        {content.projectX ? (
                          <>
                            Project <big><span>X</span></big>
                          </>
                        ) : (
                          content.title
                        )}
                      </div>
                      <div className="feature-slide-desc">{content.desc}</div>
                      <div className="feature-slide-badge">{t.common.comingSoon}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="features-slider-nav">
              <button
                className="features-nav-btn"
                aria-label={t.common.previous}
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(current - 1);
                  resetAuto();
                }}
              >
                <ChevronPrev />
              </button>
              <div className="features-dots">
                {FEATURE_SLIDES_META.map((_, i) => (
                  <div
                    key={i}
                    className={`dot${i === current ? ' active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(i);
                      resetAuto();
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={t.common.goToSlide(i + 1)}
                  />
                ))}
              </div>
              <button
                className="features-nav-btn"
                aria-label={t.common.next}
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(current + 1);
                  resetAuto();
                }}
              >
                <ChevronNext />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
