'use client';

import { PROJECTS_META } from '@/lib/projects';
import { SlideCorners } from '@/components/icons';
import { useTranslations } from '@/contexts/LocaleContext';

export default function Projects() {
  const t = useTranslations();

  return (
    <section id="projects" className="page-section projects-page">
      <div className="projects-inner">
        <div className="section-header reveal" style={{ textAlign: 'center' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            {t.projects.tag}
          </div>
          <h2 className="section-title">
            {t.projects.titlePrefix}
            <em>{t.projects.titleEm}</em>
          </h2>
          <p className="projects-lead">{t.projects.lead}</p>
        </div>

        <div className="projects-grid">
          {PROJECTS_META.map((project, index) => {
            const copy = t.projects.items[project.id];
            return (
              <article
                key={project.id}
                className={`project-card reveal accent-${project.accent}`}
                style={{ transitionDelay: `${Math.min(index, 4) * 60}ms` }}
              >
                <SlideCorners prefix="ufc-corner" />
                <div className="project-card-top">
                  <span className="project-code">
                    {t.projects.codeLabel}
                    {project.code}
                  </span>
                  <span className="project-status">{t.projects.demoBadge}</span>
                </div>

                <h3 className="project-name">{copy.name}</h3>
                <p className="project-tagline">{copy.tagline}</p>
                <p className="project-desc">{copy.desc}</p>

                <div className="project-tags" aria-label="Tags">
                  {copy.tags.map((tag) => (
                    <span key={tag} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={project.url}
                  className="project-cta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.projects.openDemo}
                  <span aria-hidden="true">↗</span>
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
