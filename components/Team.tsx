'use client';

import { TEAM_MEMBERS_META } from '@/lib/siteData';
import { InstagramIcon, LinkedInIcon, SlideCorners } from '@/components/icons';
import { useTranslations } from '@/contexts/LocaleContext';

export default function Team() {
  const t = useTranslations();

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

      <div className="team-grid reveal">
        {TEAM_MEMBERS_META.map((member) => {
          const content = t.team.members[member.id];
          return (
            <article className="team-profile" key={member.id}>
              <SlideCorners prefix="slide-corner" />
              <div className="slide-index">{content.index}</div>
              <div className="avatar-wrap">
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
            </article>
          );
        })}
      </div>
    </section>
  );
}
