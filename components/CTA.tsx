'use client';

import { GitHubIcon, InstagramIcon } from '@/components/icons';
import { useTranslations } from '@/contexts/LocaleContext';

export default function CTA() {
  const t = useTranslations();

  return (
    <section id="cta">
      <div className="cta-glow" />
      <div className="section-tag cta-tag reveal" style={{ justifyContent: 'center' }}>
        {t.cta.tag}
      </div>
      <h2 className="cta-title reveal reveal-delay-1">
        {t.cta.titlePrefix}
        <span className="c">RojTech</span>
        {t.cta.titleSuffix ? (
          <>
            <br />
            {t.cta.titleSuffix}
          </>
        ) : null}
      </h2>
      <p className="cta-sub reveal reveal-delay-2">{t.cta.sub}</p>
      <div className="cta-socials reveal reveal-delay-3">
        <a
          href="https://instagram.com/"
          className="cta-social-btn instagram"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.cta.followInstagram}
        >
          <InstagramIcon />
          {t.cta.instagram}
        </a>
        <a
          href="https://tiktok.com/"
          className="cta-social-btn tiktok"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.cta.followTiktok}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
          </svg>
          {t.cta.tiktok}
        </a>
        <a
          href="https://github.com/"
          className="cta-social-btn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.cta.viewGithub}
        >
          <GitHubIcon />
          {t.cta.github}
        </a>
      </div>
    </section>
  );
}
