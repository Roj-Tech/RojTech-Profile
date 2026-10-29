'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useTranslations } from '@/contexts/LocaleContext';

/**
 * Phone-first reader: embeds a standalone HTML viewer (not Next-bundled PDF.js).
 * This avoids blank pages on iOS/Android caused by app-router + worker bundling issues.
 */
export default function PdfReader({ id, title }: { id: string; title: string }) {
  const t = useTranslations();
  const c = t.courses;

  const viewerSrc = useMemo(
    () => `/book-viewer.html?file=${encodeURIComponent(`/api/courses/${id}/file`)}`,
    [id],
  );

  return (
    <div className="book-reader">
      <header className="tool-hero book-reader-hero">
        <div className="tool-kicker">{c.readerKicker}</div>
        <h1>{title}</h1>
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
        <a className="tool-btn tool-btn-primary" href={viewerSrc}>
          Open full reader
        </a>
      </div>

      <div className="book-iframe-shell">
        <iframe title={title || 'Book reader'} src={viewerSrc} className="book-iframe" allow="fullscreen" />
      </div>

      <p className="book-mobile-hint">
        On iPhone, tap <strong>Open full reader</strong> if the book area looks empty. That opens
        the phone-optimized viewer.
      </p>
    </div>
  );
}
