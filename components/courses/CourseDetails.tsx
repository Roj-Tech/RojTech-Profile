'use client';

import Link from 'next/link';
import type { PublicCourse } from '@/lib/courses/types';
import { useTranslations } from '@/contexts/LocaleContext';

export default function CourseDetails({ course }: { course: PublicCourse }) {
  const t = useTranslations();
  const c = t.courses;

  function difficultyLabel(value: string) {
    if (value === 'Beginner') return c.beginner;
    if (value === 'Intermediate') return c.intermediate;
    if (value === 'Advanced') return c.advanced;
    return value;
  }

  const categoryLabel = c.categories[course.categoryId] || course.categoryId;
  const isJavaBook = course.id === 'java-kurdish-rojtech';
  const accent = isJavaBook ? 'book-cover-java' : 'book-cover-default';
  const phoneReaderHref = `/book-viewer.html?file=${encodeURIComponent(`/api/courses/${course.id}/file`)}`;

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
              <a className="tool-btn tool-btn-primary" href={phoneReaderHref}>
                {c.readPdf}
              </a>
              <Link href={`/courses/${course.id}/read`} className="tool-btn">
                Open in page
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
