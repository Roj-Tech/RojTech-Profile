'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PdfReader({ id }: { id: string }) {
  const [title, setTitle] = useState('PDF Reader');
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
      .catch(() => setError('Unable to open this PDF resource.'));
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

  const src = `/api/courses/${id}/file`;

  return (
    <>
      <header className="tool-hero">
        <div className="tool-kicker">[ PDF READER ]</div>
        <h1>{title}</h1>
      </header>
      <div className="tool-input-row" style={{ marginBottom: 14 }}>
        <Link href={`/courses/${id}`} className="tool-btn">
          Details
        </Link>
        <a className="tool-btn" href={src} target="_blank" rel="noopener noreferrer">
          Open fullscreen tab
        </a>
        {allowDownload && (
          <a className="tool-btn" href={`${src}?download=1`} rel="noopener">
            Download
          </a>
        )}
      </div>
      <div className="pdf-frame-wrap">
        <iframe title={title} src={src} />
      </div>
      <p className="tool-note">
        If your browser cannot embed PDFs, use “Open fullscreen tab” or Download.
      </p>
    </>
  );
}
