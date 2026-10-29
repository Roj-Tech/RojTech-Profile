'use client';

import Link from 'next/link';
import { useTranslations } from '@/contexts/LocaleContext';

/** Redirect-style reader: prefer the standalone image viewer on every device. */
export default function PdfReader({ id, title }: { id: string; title: string }) {
  const t = useTranslations();
  const c = t.courses;
  const viewerSrc = `/book-viewer.html?id=${encodeURIComponent(id)}`;

  return (
    <div className="book-reader">
      <header className="tool-hero book-reader-hero">
        <div className="tool-kicker">{c.readerKicker}</div>
        <h1>{title}</h1>
        <p className="tool-lead book-reader-notice">
          Phone-friendly image pages · Download disabled · Swipe or use Next
        </p>
      </header>

      <div className="tool-input-row book-reader-toolbar">
        <a className="tool-btn tool-btn-primary" href={viewerSrc}>
          Open book reader
        </a>
        <Link href={`/courses/${id}`} className="tool-btn">
          {c.details}
        </Link>
        <Link href="/courses" className="tool-btn">
          {c.backLibrary}
        </Link>
      </div>

      <div className="book-iframe-shell">
        <iframe title={title || 'Book reader'} src={viewerSrc} className="book-iframe" allow="fullscreen" />
      </div>
    </div>
  );
}
