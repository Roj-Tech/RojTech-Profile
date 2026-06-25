'use client';

import { useCallback, useEffect, useState } from 'react';
import { LEARN_CARDS_META } from '@/lib/siteData';
import { SlideCorners } from '@/components/icons';
import { useTranslations } from '@/contexts/LocaleContext';

export default function LearnSection() {
  const t = useTranslations();
  const [activeId, setActiveId] = useState<string | null>(null);

  const closeLearn = useCallback(() => {
    setActiveId(null);
    document.body.style.overflow = '';
  }, []);

  const openLearn = useCallback(
    (id: string) => {
      if (!t.learn.topics[id]) return;
      setActiveId(id);
      document.body.style.overflow = 'hidden';
    },
    [t.learn.topics],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeId) closeLearn();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [activeId, closeLearn]);

  const topic = activeId ? t.learn.topics[activeId] : null;
  const topicIcon = activeId ? LEARN_CARDS_META.find((c) => c.id === activeId)?.icon : null;

  return (
    <>
      <section id="skills">
        <div className="section-header reveal" style={{ textAlign: 'center' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            {t.learn.tag}
          </div>
          <h2 className="section-title">
            {t.learn.titlePrefix}
            <em>{t.learn.titleEm}</em>
          </h2>
          <p className="learn-hint">{t.learn.hint}</p>
        </div>
        <div className="skills-grid">
          {LEARN_CARDS_META.map((card) => {
            const content = t.learn.cards[card.id];
            return (
              <div
                key={card.id}
                className={`skill-card learn-card reveal ${card.delay}`}
                role="button"
                tabIndex={0}
                aria-label={t.common.learnAbout(content.name)}
                onClick={() => openLearn(card.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLearn(card.id);
                  }
                }}
              >
                <div className="skill-header">
                  <div className="skill-icon">{card.icon}</div>
                  <div>
                    <div className="skill-name">{content.name}</div>
                    <div className="skill-sub">{content.sub}</div>
                  </div>
                </div>
                <div className="skill-tags">
                  {content.tags.map((tag) => (
                    <span className="skill-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="skill-hint">{t.common.openLesson}</div>
              </div>
            );
          })}
        </div>
      </section>

      <div
        className={`learn-modal-overlay${activeId ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="learnModalTitle"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLearn();
        }}
      >
        <div className="learn-modal">
          <SlideCorners prefix="learn-modal-corner" />
          <button className="learn-modal-close" aria-label={t.common.closeLesson} onClick={closeLearn}>
            ✕
          </button>
          {topic && (
            <>
              <div className="learn-modal-head">
                <div className="learn-modal-icon">{topicIcon}</div>
                <div className="learn-modal-tag">[ {topic.tag} ]</div>
                <h3 className="learn-modal-title" id="learnModalTitle">
                  {topic.title}
                </h3>
                <div className="learn-modal-divider" />
              </div>
              <div className="learn-modal-body">
                {topic.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
