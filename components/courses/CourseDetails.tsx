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

  return (
    <>
      <header className="tool-hero">
        <div className="tool-kicker">{c.detailsKicker}</div>
        <h1>{course.title}</h1>
        <p className="tool-lead">{course.description}</p>
      </header>

      <section className="tool-panel">
        <div className="tool-checks">
          <div className="tool-check ok">{categoryLabel}</div>
          <div className="tool-check ok">{difficultyLabel(course.difficulty)}</div>
          <div className="tool-check ok">{course.subject}</div>
          {course.author ? (
            <div className="tool-check ok">
              {c.author} {course.author}
            </div>
          ) : null}
          <div className="tool-check ok">
            {c.added} {new Date(course.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="tool-input-row" style={{ marginTop: 16 }}>
          <Link href={`/courses/${course.id}/read`} className="tool-btn tool-btn-primary">
            {c.readPdf}
          </Link>
          {course.allowDownload && (
            <a
              className="tool-btn"
              href={`/api/courses/${course.id}/file?download=1`}
              rel="noopener"
            >
              {c.downloadPdf}
            </a>
          )}
          <Link href="/courses" className="tool-btn">
            {c.backLibrary}
          </Link>
        </div>
      </section>
    </>
  );
}
