'use client';

import { TEAM_MEMBERS_META } from '@/lib/siteData';
import { useSlider } from '@/hooks/useSlider';
import { InstagramIcon, LinkedInIcon, ChevronNext, ChevronPrev, SlideCorners } from '@/components/icons';
import { useTranslations } from '@/contexts/LocaleContext';

export default function Team() {
  const t = useTranslations();
  const { current, goTo, trackRef } = useSlider({ total: TEAM_MEMBERS_META.length });

  return (
    <section id="team">
      <div className="section-header reveal" style={{ textAlign: 'center' }}>
        <div className="section-tag" style={{ justifyContent: 'center' }}>
          {t.team.tag}
        </div>
        <h2 className="section-title">
          {t.team.titlePrefix}
          <em>{t.team.titleEm}</em>
        </h2>
      </div>

      <div className="team-slider-wrap reveal">
        <div className="team-slider-viewport">
          <div className="team-slider-track" ref={trackRef}>
            {TEAM_MEMBERS_META.map((member) => {
              const content = t.team.members[member.id];
              return (
                <div className="team-slide" key={member.id}>
                  <SlideCorners prefix="slide-corner" />
                  <div className="slide-index">{content.index}</div>
                  <div className="avatar-wrap" style={{ marginBottom: 24 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={member.image} alt={member.name} className="avatar" />
                    <div className="avatar-ring" />
                    <div className="avatar-ring2" />
                  </div>
                  <div className="member-name">{member.name}</div>
                  <div className="member-role-wrap">
                    <div className="member-role">{content.role}</div>
                    {content.roleLine2 ? (
                      <div className="member-role member-role-sub">{content.roleLine2}</div>
                    ) : null}
                  </div>
                  <div className="divider-line" />
                  <p className="member-bio">{content.bio}</p>
                  <div className="member-socials">
                    <a
                      href={member.instagram ?? '#'}
                      className="social-icon"
                      aria-label={t.cta.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <InstagramIcon />
                    </a>
                    <a
                      href={member.linkedin ?? '#'}
                      className="social-icon"
                      aria-label="LinkedIn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedInIcon />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="team-nav">
          <button className="team-nav-btn" aria-label={t.common.previous} onClick={() => goTo(current - 1)}>
            <ChevronPrev />
          </button>
          <div className="team-nav-counter">
            <span>{String(current + 1).padStart(2, '0')}</span> /{' '}
            <span>{String(TEAM_MEMBERS_META.length).padStart(2, '0')}</span>
          </div>
          <button className="team-nav-btn" aria-label={t.common.next} onClick={() => goTo(current + 1)}>
            <ChevronNext />
          </button>
        </div>

        <div className="team-dots">
          {TEAM_MEMBERS_META.map((_, i) => (
            <div
              key={i}
              className={`team-dot${i === current ? ' active' : ''}`}
              onClick={() => goTo(i)}
              role="button"
              tabIndex={0}
              aria-label={t.common.goToMember(i + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
