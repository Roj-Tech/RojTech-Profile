'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { CourseCategory, PublicCourse } from '@/lib/courses/types';

type ApiResponse = {
  courses: PublicCourse[];
  categories: CourseCategory[];
};

export default function CoursesLibrary() {
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
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') setError('Could not load the courses library.');
      });
    return () => controller.abort();
  }, [search, category, subject, difficulty, sort]);

  const recent = useMemo(() => (data?.courses || []).slice(0, 3), [data]);

  return (
    <>
      <header className="tool-hero">
        <div className="tool-kicker">[ MODULE_02 · LEARNING LIBRARY ]</div>
        <h1>
          Courses <em>Library</em>
        </h1>
        <p className="tool-lead">
          Browse published PDF learning resources across programming, cybersecurity, networking,
          and software engineering.
        </p>
      </header>

      <section className="tool-panel">
        <div className="course-filters">
          <input
            className="tool-input"
            placeholder="Search title or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search courses"
          />
          <select
            className="tool-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {(data?.categories || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            className="tool-input"
            placeholder="Language / subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            aria-label="Filter by subject"
          />
          <select
            className="tool-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            aria-label="Filter by difficulty"
          >
            <option value="">All levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <select
            className="tool-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort courses"
          >
            <option value="newest">Newest</option>
            <option value="title">A–Z</option>
          </select>
        </div>

        {error && <p className="feedback-toast error">{error}</p>}

        {!error && !data && (
          <p className="tool-note">
            <span className="loading-dot" />
            Loading library…
          </p>
        )}

        {data && recent.length > 0 && !search && !category && !subject && !difficulty && (
          <div style={{ marginBottom: 22 }}>
            <h2>Recently added</h2>
            <div className="courses-grid" style={{ marginTop: 12 }}>
              {recent.map((course) => (
                <CourseCard key={`recent-${course.id}`} course={course} categories={data.categories} />
              ))}
            </div>
          </div>
        )}

        <h2>All resources</h2>
        {data && data.courses.length === 0 ? (
          <div className="empty-state" style={{ marginTop: 12 }}>
            No published resources match these filters yet.
          </div>
        ) : (
          <div className="courses-grid" style={{ marginTop: 12 }}>
            {(data?.courses || []).map((course) => (
              <CourseCard key={course.id} course={course} categories={data?.categories || []} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function CourseCard({
  course,
  categories,
}: {
  course: PublicCourse;
  categories: CourseCategory[];
}) {
  const cat = categories.find((c) => c.id === course.categoryId)?.name || course.categoryId;
  return (
    <Link href={`/courses/${course.id}`} className="course-card">
      <div className="course-meta">
        {cat} · {course.difficulty}
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
