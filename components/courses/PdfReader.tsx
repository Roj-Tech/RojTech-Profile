'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from '@/contexts/LocaleContext';

export default function PdfReader({ id }: { id: string }) {
  const t = useTranslations();
  const c = t.courses;
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [metaRes, courseRes] = await Promise.all([
          fetch(`/book-pages/${encodeURIComponent(id)}/meta.json`, { cache: 'no-store' }),
          fetch(`/api/courses/${id}`),
        ]);

        if (courseRes.ok) {
          const courseData = await courseRes.json();
          if (!cancelled) setTitle(courseData.course?.title || '');
        }

        if (metaRes.ok) {
          const meta = await metaRes.json();
          if (!cancelled) {
            setTotal(meta.pages || 0);
            setTitle((prev) => prev || meta.title || '');
            setPage(1);
          }
        } else {
          // Fallback: classic PDF file path if images are missing
          const fileRes = await fetch(`/api/courses/${id}/file`, { method: 'HEAD' });
          if (!fileRes.ok) throw new Error('missing');
          if (!cancelled) setError(c.readerError);
          return;
        }
      } catch {
        if (!cancelled) setError(c.readerError);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id, c.readerError]);

  useEffect(() => {
    const onContext = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (key === 's' || key === 'p')) e.preventDefault();
      if (key === 'printscreen') e.preventDefault();
    };
    const node = wrapRef.current;
    node?.addEventListener('contextmenu', onContext);
    window.addEventListener('keydown', onKey);
    return () => {
      node?.removeEventListener('contextmenu', onContext);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

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

  const pageSrc = `/book-pages/${encodeURIComponent(id)}/p-${page}.jpg`;

  return (
    <div className="book-reader" ref={wrapRef}>
      <header className="tool-hero">
        <div className="tool-kicker">{c.readerKicker}</div>
        <h1>{title || '…'}</h1>
        <p className="tool-lead book-reader-notice">
          Read-only viewer · Download is disabled · Content is for online reading on RojTech only.
        </p>
      </header>

      <div className="tool-input-row book-reader-toolbar">
        <Link href={`/courses/${id}`} className="tool-btn">
          {c.details}
        </Link>
        <Link href="/courses" className="tool-btn">
          {c.backLibrary}
        </Link>
        <button
          type="button"
          className="tool-btn"
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          ← Prev
        </button>
        <span className="book-page-indicator">{total ? `${page} / ${total}` : '…'}</span>
        <button
          type="button"
          className="tool-btn"
          disabled={!total || page >= total || loading}
          onClick={() => setPage((p) => Math.min(total, p + 1))}
        >
          Next →
        </button>
        <button
          type="button"
          className="tool-btn"
          onClick={() => setScale((s) => Math.max(0.7, Number((s - 0.15).toFixed(2))))}
        >
          −
        </button>
        <button
          type="button"
          className="tool-btn"
          onClick={() => setScale((s) => Math.min(2.2, Number((s + 0.15).toFixed(2))))}
        >
          +
        </button>
      </div>

      <div className="book-stage">
        <div className="book-stage-shield" aria-hidden />
        {loading && (
          <p className="tool-note">
            <span className="loading-dot" />
            Opening book…
          </p>
        )}
        {!loading && total > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pageSrc}
            alt={`Page ${page}`}
            className="book-canvas"
            draggable={false}
            style={{
              width: `${scale * 100}%`,
              maxWidth: 'none',
              height: 'auto',
              display: 'block',
              margin: '0 auto',
              background: '#fff',
            }}
            onLoad={() => {
              if (page < total) {
                const warm = new window.Image();
                warm.src = `/book-pages/${encodeURIComponent(id)}/p-${page + 1}.jpg`;
              }
            }}
          />
        )}
        <div className="book-watermark" aria-hidden>
          RojTech · Read only
        </div>
      </div>

      <p className="tool-note">
        Screenshots and screen recording cannot be fully blocked by any website. This book is
        served without a download button and without the browser PDF toolbar so casual saving is
        harder — please respect Team RojTech’s read-only access.
      </p>
    </div>
  );
}
