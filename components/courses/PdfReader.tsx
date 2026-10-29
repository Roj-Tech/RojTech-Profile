'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from '@/contexts/LocaleContext';

type PageMeta = { title?: string; pages: number };

/**
 * Read-only book viewer — no PDF file is exposed, so visitors cannot download it.
 * Pages are shown in the classic Prev / Next / zoom reader.
 */
export default function PdfReader({ id, title }: { id: string; title: string }) {
  const t = useTranslations();
  const c = t.courses;
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [blurred, setBlurred] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/book-pages/${encodeURIComponent(id)}/meta.json`, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error('missing');
        return res.json() as Promise<PageMeta>;
      })
      .then((meta) => {
        if (!alive) return;
        setTotal(meta.pages || 0);
        setPage(1);
      })
      .catch(() => {
        if (alive) setError(c.readerError);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id, c.readerError]);

  useEffect(() => {
    const onContext = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // Block save / print / “save as”
      if ((e.ctrlKey || e.metaKey) && (key === 's' || key === 'p' || key === 'u')) {
        e.preventDefault();
      }
      if (key === 'printscreen') {
        e.preventDefault();
        setBlurred(true);
        window.setTimeout(() => setBlurred(false), 1500);
      }
    };
    const onVis = () => {
      // Soft deterrent when tab is captured / switched during reading
      if (document.hidden) setBlurred(true);
      else window.setTimeout(() => setBlurred(false), 400);
    };

    const node = wrapRef.current;
    node?.addEventListener('contextmenu', onContext);
    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      node?.removeEventListener('contextmenu', onContext);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const pageSrc = `/book-pages/${encodeURIComponent(id)}/p-${page}.jpg`;

  const goPrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goNext = useCallback(() => setPage((p) => Math.min(total, p + 1)), [total]);

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

  return (
    <div className={`book-reader${blurred ? ' book-reader-blurred' : ''}`} ref={wrapRef}>
      <header className="tool-hero">
        <div className="tool-kicker">{c.readerKicker}</div>
        <h1>{title}</h1>
        <p className="tool-lead book-reader-notice">
          Read-only · PDF download disabled · Online reading on RojTech only
        </p>
      </header>

      <div className="tool-input-row book-reader-toolbar">
        <Link href={`/courses/${id}`} className="tool-btn">
          {c.details}
        </Link>
        <Link href="/courses" className="tool-btn">
          {c.backLibrary}
        </Link>
        <button type="button" className="tool-btn" disabled={page <= 1 || loading} onClick={goPrev}>
          ← Prev
        </button>
        <span className="book-page-indicator">{total ? `${page} / ${total}` : '…'}</span>
        <button
          type="button"
          className="tool-btn"
          disabled={!total || page >= total || loading}
          onClick={goNext}
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
            alt=""
            className="book-canvas"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            style={{
              width: `${scale * 100}%`,
              maxWidth: 'none',
              height: 'auto',
              display: 'block',
              margin: '0 auto',
              background: '#fff',
              pointerEvents: 'none',
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
          RojTech · Read only · No download
        </div>
      </div>

      <p className="tool-note">
        The PDF file cannot be downloaded. Reading is online-only inside RojTech. Screenshots and
        screen recording cannot be fully blocked by any website — please respect Team RojTech’s
        read-only access.
      </p>
    </div>
  );
}
