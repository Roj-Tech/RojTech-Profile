'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { PublicCourse } from '@/lib/courses/types';

export default function CourseDetails({ id }: { id: string }) {
  const [course, setCourse] = useState<PublicCourse | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then((data) => {
        setCourse(data.course);
        setCategoryName(data.categoryName || '');
      })
      .catch(() => setError('This resource is unavailable or unpublished.'));
  }, [id]);

  if (error) {
    return (
      <div className="tool-panel">
        <p className="feedback-toast error">{error}</p>
        <Link href="/courses" className="tool-btn">
          Back to library
        </Link>
      </div>
    );
  }

  if (!course) {
    return (
      <p className="tool-note">
        <span className="loading-dot" />
        Loading resource…
      </p>
    );
  }

  return (
    <>
      <header className="tool-hero">
        <div className="tool-kicker">[ RESOURCE DETAILS ]</div>
        <h1>{course.title}</h1>
        <p className="tool-lead">{course.description}</p>
      </header>

      <section className="tool-panel">
        <div className="tool-checks">
          <div className="tool-check ok">{categoryName || course.categoryId}</div>
          <div className="tool-check ok">{course.difficulty}</div>
          <div className="tool-check ok">{course.subject}</div>
          {course.author ? <div className="tool-check ok">Author: {course.author}</div> : null}
          <div className="tool-check ok">
            Added {new Date(course.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="tool-input-row" style={{ marginTop: 16 }}>
          <Link href={`/courses/${course.id}/read`} className="tool-btn tool-btn-primary">
            Read PDF
          </Link>
          {course.allowDownload && (
            <a
              className="tool-btn"
              href={`/api/courses/${course.id}/file?download=1`}
              rel="noopener"
            >
              Download PDF
            </a>
          )}
          <Link href="/courses" className="tool-btn">
            Back to library
          </Link>
        </div>
      </section>
    </>
  );
}
