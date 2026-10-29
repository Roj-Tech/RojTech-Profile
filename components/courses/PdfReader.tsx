'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from '@/contexts/LocaleContext';

type PdfDoc = {
  numPages: number;
  getPage: (n: number) => Promise<{
    getViewport: (opts: { scale: number }) => { width: number; height: number };
    render: (opts: {
      canvasContext: CanvasRenderingContext2D;
      viewport: { width: number; height: number };
      canvas: HTMLCanvasElement;
    }) => { promise: Promise<void> };
  }>;
  destroy: () => Promise<void>;
};

export default function PdfReader({ id }: { id: string }) {
  const t = useTranslations();
  const c = t.courses;
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1.15);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const docRef = useRef<PdfDoc | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('missing');
        return res.json();
      })
      .then((data) => {
        setTitle(data.course.title);
      })
      .catch(() => setError(c.readerError));
  }, [id, c.readerError]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';

        const res = await fetch(`/api/courses/${id}/file`, { cache: 'no-store' });
        if (!res.ok) throw new Error('file');
        const data = new Uint8Array(await res.arrayBuffer());
        if (cancelled) return;

        if (docRef.current) {
          await docRef.current.destroy().catch(() => undefined);
          docRef.current = null;
        }

        const doc = (await pdfjs.getDocument({ data }).promise) as unknown as PdfDoc;
        if (cancelled) {
          await doc.destroy();
          return;
        }
        docRef.current = doc;
        setTotal(doc.numPages);
        setPage(1);
      } catch {
        if (!cancelled) setError(c.readerError);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
      void docRef.current?.destroy().catch(() => undefined);
      docRef.current = null;
    };
  }, [id, c.readerError]);

  const renderPage = useCallback(async () => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    if (!doc || !canvas || page < 1) return;

    const pdfPage = await doc.getPage(page);
    const viewport = pdfPage.getViewport({ scale });
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    await pdfPage.render({
      canvasContext: ctx,
      viewport,
      canvas,
    }).promise;
  }, [page, scale]);

  useEffect(() => {
    void renderPage();
  }, [renderPage]);

  useEffect(() => {
    const onContext = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      // Block common print / save shortcuts in this reader
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (key === 's' || key === 'p')) {
        e.preventDefault();
      }
      if (key === 'printscreen') {
        e.preventDefault();
      }
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
        <span className="book-page-indicator">
          {total ? `${page} / ${total}` : '…'}
        </span>
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
        <canvas ref={canvasRef} className="book-canvas" />
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
