'use client';

import { useTranslations } from '@/contexts/LocaleContext';

export default function About() {
  const t = useTranslations();

  return (
    <section id="about">
      <div className="about-inner">
        <div>
          <div className="section-header reveal">
            <div className="section-tag">{t.about.tag}</div>
            <h2 className="section-title">
              {t.about.titleLine1}
              <br />
              <em>{t.about.titleEm}</em>
            </h2>
          </div>
          <div className="about-text reveal reveal-delay-1">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <p>{t.about.p3}</p>
          </div>
        </div>
        <div className="stats-grid reveal reveal-delay-2">
          {t.about.focusAreas.map((area) => (
            <div className="stat-card" key={area}>
              <div className="stat-num stat-focus">{area}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
