'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CourseCategory, PublicCourse } from '@/lib/courses/types';
import { useTranslations } from '@/contexts/LocaleContext';

type ApiResponse = {
  courses: PublicCourse[];
  categories: CourseCategory[];
};

/** iPhone Safari often rejects aborted fetches as TypeError, not AbortError. */
function isAbortError(err: unknown) {
  if (!err || typeof err !== 'object') return false;
  const e = err as { name?: string; message?: string };
  if (e.name === 'AbortError') return true;
  const msg = (e.message || '').toLowerCase();
  return msg.includes('aborted') || msg.includes('abort') || msg.includes('cancelled');
}

export default function CoursesLibrary({ initialData }: { initialData: ApiResponse }) {
  const t = useTranslations();
  const c = t.courses;
  const [data, setData] = useState<ApiResponse>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sort, setSort] = useState('newest');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [debouncedSubject, setDebouncedSubject] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSubject(subject.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [subject]);

  useEffect(() => {
    // First paint already has server data; only refetch when filters change.
    const isDefault =
      !debouncedSearch && !category && !debouncedSubject && !difficulty && sort === 'newest';
    if (isDefault) {
      setData(initialData);
      setError(null);
      return;
    }

    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (category) params.set('category', category);
    if (debouncedSubject) params.set('subject', debouncedSubject);
    if (difficulty) params.set('difficulty', difficulty);
    params.set('sort', sort);

    let cancelled = false;
    const controller = new AbortController();

    fetch(`/api/courses?${params.toString()}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load courses');
        return res.json() as Promise<ApiResponse>;
      })
      .then((payload) => {
        if (cancelled) return;
        setData(payload);
        setError(null);
      })
      .catch((err) => {
        if (cancelled || isAbortError(err) || controller.signal.aborted) return;
        // Keep last good shelf visible; show a soft error only if empty.
        setError(c.loadError);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [debouncedSearch, category, debouncedSubject, difficulty, sort, initialData, c.loadError]);

  const books = useMemo(() => data?.courses || [], [data]);

  function categoryName(id: string) {
    return c.categories[id] || data?.categories.find((cat) => cat.id === id)?.name || id;
  }

  function difficultyLabel(value: string) {
    if (value === 'Beginner') return c.beginner;
    if (value === 'Intermediate') return c.intermediate;
    if (value === 'Advanced') return c.advanced;
    return value;
  }

  return (
    <>
      <header className="tool-hero">
        <div className="tool-kicker">{c.kicker}</div>
        <h1>
          {c.title} <em>{c.titleEm}</em>
        </h1>
        <p className="tool-lead">{c.lead}</p>
      </header>

      <section className="tool-panel">
        <div className="tool-input-row" style={{ marginBottom: 16 }}>
          <a className="tool-btn tool-btn-primary" href="/book-viewer.html?id=java-kurdish-rojtech">
            Open Java Kurdish book
          </a>
          <a className="tool-btn" href="/java-book">
            Phone shortcut
          </a>
        </div>

        <div className="course-filters">
          <input
            className="tool-input"
            placeholder={c.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={c.searchPlaceholder}
          />
          <select
            className="tool-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label={c.allCategories}
          >
            <option value="">{c.allCategories}</option>
            {(data?.categories || []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {categoryName(cat.id)}
              </option>
            ))}
          </select>
          <input
            className="tool-input"
            placeholder={c.subjectPlaceholder}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            aria-label={c.subjectPlaceholder}
          />
          <select
            className="tool-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            aria-label={c.allLevels}
          >
            <option value="">{c.allLevels}</option>
            <option value="Beginner">{c.beginner}</option>
            <option value="Intermediate">{c.intermediate}</option>
            <option value="Advanced">{c.advanced}</option>
          </select>
          <select
            className="tool-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label={c.sortNewest}
          >
            <option value="newest">{c.sortNewest}</option>
            <option value="title">{c.sortTitle}</option>
          </select>
        </div>

        {error && books.length === 0 && <p className="feedback-toast error">{error}</p>}

        <h2 className="bookshelf-heading">Bookshelf</h2>
        {books.length === 0 ? (
          <div className="empty-state" style={{ marginTop: 12 }}>
            {c.empty}
          </div>
        ) : (
          <div className="bookshelf" style={{ marginTop: 16 }}>
            {books.map((course) => (
              <BookCard
                key={course.id}
                course={course}
                categoryLabel={categoryName(course.categoryId)}
                difficultyLabel={difficultyLabel(course.difficulty)}
                readLabel={c.readPdf}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function BookCard({
  course,
  categoryLabel,
  difficultyLabel,
  readLabel,
}: {
  course: PublicCourse;
  categoryLabel: string;
  difficultyLabel: string;
  readLabel: string;
}) {
  const accent =
    course.id === 'java-kurdish-rojtech'
      ? 'book-cover-java'
      : course.categoryId === 'cybersecurity'
        ? 'book-cover-cyber'
        : 'book-cover-default';

  // Java book opens the image reader directly (reliable on iPhone).
  const href =
    course.id === 'java-kurdish-rojtech'
      ? `/book-viewer.html?id=${encodeURIComponent(course.id)}`
      : `/courses/${course.id}`;

  return (
    <a href={href} className="book-card">
      <div className={`book-cover ${accent}`}>
        <div className="book-spine" />
        <div className="book-cover-inner">
          <span className="book-cover-badge">READ ONLY</span>
          <h3 className="book-cover-title">{course.title}</h3>
          <p className="book-cover-author">{course.author || 'RojTech'}</p>
        </div>
      </div>
      <div className="book-card-meta">
        <div className="course-meta">
          {categoryLabel} · {difficultyLabel}
        </div>
        <p className="book-card-desc">
          {course.description.slice(0, 110)}
          {course.description.length > 110 ? '…' : ''}
        </p>
        <span className="book-card-cta">{readLabel}</span>
      </div>
    </a>
  );
}
