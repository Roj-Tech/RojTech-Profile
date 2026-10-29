'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { PublicCourse } from '@/lib/courses/types';
import { useTranslations } from '@/contexts/LocaleContext';

export default function CourseDetails({ id }: { id: string }) {
  const t = useTranslations();
  const c = t.courses;
  const [course, setCourse] = useState<PublicCourse | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then((data) => {
        setCourse(data.course);
        setCategoryId(data.course.categoryId || '');
      })
      .catch(() => setError(c.unavailable));
  }, [id, c.unavailable]);

  function difficultyLabel(value: string) {
    if (value === 'Beginner') return c.beginner;
    if (value === 'Intermediate') return c.intermediate;
    if (value === 'Advanced') return c.advanced;
    return value;
  }

  if (error) {
    return (
      <div className="tool-panel">
        <p className="feedback-toast error">{error}</p>
        <Link href="/courses" className="tool-btn">
          {c.backLibrary}
        </Link>
      </div>
    );
  }

  if (!course) {
    return (
      <p className="tool-note">
        <span className="loading-dot" />
        {c.loadingResource}
      </p>
    );
  }

  const categoryLabel = c.categories[categoryId] || categoryId;
  const isJavaBook = course.id === 'java-kurdish-rojtech';
  const accent = isJavaBook ? 'book-cover-java' : 'book-cover-default';

  return (
    <>
      <header className="tool-hero">
        <div className="tool-kicker">{c.detailsKicker}</div>
        <h1>{course.title}</h1>
        <p className="tool-lead">{course.description}</p>
      </header>

      <section className="tool-panel book-details-panel">
        <div className="book-details-layout">
          <div className={`book-cover book-cover-lg ${accent}`}>
            <div className="book-spine" />
            <div className="book-cover-inner">
              <span className="book-cover-badge">READ ONLY</span>
              <h3 className="book-cover-title">{course.title}</h3>
              <p className="book-cover-author">{course.author || 'RojTech'}</p>
              {isJavaBook && <p className="book-cover-lang">کوردی · Java</p>}
            </div>
          </div>

          <div className="book-details-copy">
            <div className="tool-checks">
              <div className="tool-check ok">{categoryLabel}</div>
              <div className="tool-check ok">{difficultyLabel(course.difficulty)}</div>
              <div className="tool-check ok">{course.subject}</div>
              {course.author ? (
                <div className="tool-check ok">
                  {c.author} {course.author}
                </div>
              ) : null}
              <div className="tool-check ok">Online reading only</div>
            </div>

            <p className="tool-note" style={{ marginTop: 14 }}>
              This book can be read inside RojTech. Download is turned off for everyone.
            </p>

            <div className="tool-input-row" style={{ marginTop: 16 }}>
              <Link href={`/courses/${course.id}/read`} className="tool-btn tool-btn-primary">
                {c.readPdf}
              </Link>
              <Link href="/courses" className="tool-btn">
                {c.backLibrary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
