'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { CourseCategory, PublicCourse } from '@/lib/courses/types';
import { useTranslations } from '@/contexts/LocaleContext';

type ApiResponse = {
  courses: PublicCourse[];
  categories: CourseCategory[];
};

export default function CoursesLibrary() {
  const t = useTranslations();
  const c = t.courses;
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (category) params.set('category', category);
    if (subject.trim()) params.set('subject', subject.trim());
    if (difficulty) params.set('difficulty', difficulty);
    params.set('sort', sort);

    const controller = new AbortController();
    fetch(`/api/courses?${params.toString()}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load courses');
        return res.json() as Promise<ApiResponse>;
      })
      .then((payload) => {
        setData(payload);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(c.loadError);
      });
    return () => controller.abort();
  }, [search, category, subject, difficulty, sort, c.loadError]);

  const recent = useMemo(() => (data?.courses || []).slice(0, 3), [data]);

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

        {error && <p className="feedback-toast error">{error}</p>}

        {!error && !data && (
          <p className="tool-note">
            <span className="loading-dot" />
            {c.loading}
          </p>
        )}

        {data && recent.length > 0 && !search && !category && !subject && !difficulty && (
          <div style={{ marginBottom: 22 }}>
            <h2>{c.recentlyAdded}</h2>
            <div className="courses-grid" style={{ marginTop: 12 }}>
              {recent.map((course) => (
                <CourseCard
                  key={`recent-${course.id}`}
                  course={course}
                  categoryLabel={categoryName(course.categoryId)}
                  difficultyLabel={difficultyLabel(course.difficulty)}
                />
              ))}
            </div>
          </div>
        )}

        <h2>{c.allResources}</h2>
        {data && data.courses.length === 0 ? (
          <div className="empty-state" style={{ marginTop: 12 }}>
            {c.empty}
          </div>
        ) : (
          <div className="courses-grid" style={{ marginTop: 12 }}>
            {(data?.courses || []).map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                categoryLabel={categoryName(course.categoryId)}
                difficultyLabel={difficultyLabel(course.difficulty)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function CourseCard({
  course,
  categoryLabel,
  difficultyLabel,
}: {
  course: PublicCourse;
  categoryLabel: string;
  difficultyLabel: string;
}) {
  return (
    <Link href={`/courses/${course.id}`} className="course-card">
      <div className="course-meta">
        {categoryLabel} · {difficultyLabel}
      </div>
      <h3>{course.title}</h3>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', flex: 1 }}>
        {course.description.slice(0, 120)}
        {course.description.length > 120 ? '…' : ''}
      </p>
      <div className="course-meta">{course.subject}</div>
    </Link>
  );
}
