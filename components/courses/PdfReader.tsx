'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from '@/contexts/LocaleContext';

/**
 * Phone-first reader: embeds a standalone HTML viewer (not Next-bundled PDF.js).
 * This avoids blank pages on iOS/Android caused by app-router + worker bundling issues.
 */
export default function PdfReader({ id }: { id: string }) {
  const t = useTranslations();
  const c = t.courses;
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const viewerSrc = useMemo(
    () => `/book-viewer.html?file=${encodeURIComponent(`/api/courses/${id}/file`)}`,
    [id],
  );

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('missing');
        return res.json();
      })
      .then((data) => {
        setTitle(data.course.title);
        setReady(true);
      })
      .catch(() => setError(c.readerError));
  }, [id, c.readerError]);

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
    <div className="book-reader">
      <header className="tool-hero book-reader-hero">
        <div className="tool-kicker">{c.readerKicker}</div>
        <h1>{title || '…'}</h1>
        <p className="tool-lead book-reader-notice">
          Read-only on phone & computer · Download disabled · Swipe to turn pages
        </p>
      </header>

      <div className="tool-input-row book-reader-toolbar">
        <Link href={`/courses/${id}`} className="tool-btn">
          {c.details}
        </Link>
        <Link href="/courses" className="tool-btn">
          {c.backLibrary}
        </Link>
        <a className="tool-btn tool-btn-primary" href={viewerSrc} target="_blank" rel="noopener noreferrer">
          Open full reader
        </a>
      </div>

      {ready ? (
        <div className="book-iframe-shell">
          <iframe
            title={title || 'Book reader'}
            src={viewerSrc}
            className="book-iframe"
            allow="fullscreen"
            // sandbox keeps it same-origin enough for API fetch with allow-same-origin
            // scripts needed for pdf.js
          />
        </div>
      ) : (
        <p className="tool-note">
          <span className="loading-dot" />
          Preparing book for your device…
        </p>
      )}

      <p className="book-mobile-hint">
        If the book area looks empty on your phone, tap <strong>Open full reader</strong>. That
        opens a phone-optimized viewer.
      </p>
    </div>
  );
}
