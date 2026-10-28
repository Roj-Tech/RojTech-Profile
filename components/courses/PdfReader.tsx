'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslations } from '@/contexts/LocaleContext';

export default function PdfReader({ id }: { id: string }) {
  const t = useTranslations();
  const c = t.courses;
  const [title, setTitle] = useState('');
  const [allowDownload, setAllowDownload] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('missing');
        return res.json();
      })
      .then((data) => {
        setTitle(data.course.title);
        setAllowDownload(Boolean(data.course.allowDownload));
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

  const src = `/api/courses/${id}/file`;

  return (
    <>
      <header className="tool-hero">
        <div className="tool-kicker">{c.readerKicker}</div>
        <h1>{title || '…'}</h1>
      </header>
      <div className="tool-input-row" style={{ marginBottom: 14 }}>
        <Link href={`/courses/${id}`} className="tool-btn">
          {c.details}
        </Link>
        <a className="tool-btn" href={src} target="_blank" rel="noopener noreferrer">
          {c.openFullscreen}
        </a>
        {allowDownload && (
          <a className="tool-btn" href={`${src}?download=1`} rel="noopener">
            {c.download}
          </a>
        )}
      </div>
      <div className="pdf-frame-wrap">
        <iframe title={title || 'PDF'} src={src} />
      </div>
      <p className="tool-note">{c.readerFallback}</p>
    </>
  );
}
