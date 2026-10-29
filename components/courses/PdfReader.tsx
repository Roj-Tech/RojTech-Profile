'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from '@/contexts/LocaleContext';

type PdfPage = {
  getViewport: (opts: { scale: number }) => { width: number; height: number };
  render: (opts: Record<string, unknown>) => { promise: Promise<void> };
};

type PdfDoc = {
  numPages: number;
  getPage: (n: number) => Promise<PdfPage>;
  destroy: () => Promise<void>;
};

function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 900px), (hover: none)').matches;
}

export default function PdfReader({ id }: { id: string }) {
  const t = useTranslations();
  const c = t.courses;
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [renderError, setRenderError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<PdfDoc | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('missing');
        return res.json();
      })
      .then((data) => setTitle(data.course.title))
      .catch(() => setError(c.readerError));
  }, [id, c.readerError]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setRenderError(null);
      try {
        // Legacy build works more reliably on iOS Safari / older Android WebViews
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';

        const res = await fetch(`/api/courses/${id}/file`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`file ${res.status}`);
        const buffer = await res.arrayBuffer();
        if (cancelled) return;

        if (docRef.current) {
          await docRef.current.destroy().catch(() => undefined);
          docRef.current = null;
        }

        const doc = (await pdfjs.getDocument({
          data: new Uint8Array(buffer),
          disableStream: true,
          useSystemFonts: true,
        }).promise) as unknown as PdfDoc;

        if (cancelled) {
          await doc.destroy();
          return;
        }

        docRef.current = doc;
        setTotal(doc.numPages);
        setPage(1);
        setZoom(1);
      } catch (err) {
        console.error('PDF load failed', err);
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
    const stage = stageRef.current;
    if (!doc || !canvas || !stage || page < 1 || page > doc.numPages) return;

    try {
      setRenderError(null);
      const pdfPage = await doc.getPage(page);
      const base = pdfPage.getViewport({ scale: 1 });

      // Fit page to phone / tablet / desktop stage width
      const padding = 16;
      const available = Math.max(260, stage.clientWidth - padding);
      const fit = available / base.width;
      const scale = fit * zoom;
      const viewport = pdfPage.getViewport({ scale });

      const outputScale = Math.min(window.devicePixelRatio || 1, 2);
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) throw new Error('no-2d');

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      ctx.setTransform(outputScale, 0, 0, outputScale, 0, 0);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, viewport.width, viewport.height);

      const task = pdfPage.render({
        canvasContext: ctx,
        viewport,
        canvas,
      });
      await task.promise;
    } catch (err) {
      console.error('PDF render failed', err);
      setRenderError('Could not draw this page on your device. Try Next page or refresh.');
    }
  }, [page, zoom]);

  useEffect(() => {
    void renderPage();
  }, [renderPage, total, loading]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      void renderPage();
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, [renderPage]);

  useEffect(() => {
    const onContext = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (key === 's' || key === 'p')) e.preventDefault();
    };
    const node = wrapRef.current;
    node?.addEventListener('contextmenu', onContext);
    window.addEventListener('keydown', onKey);
    return () => {
      node?.removeEventListener('contextmenu', onContext);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchX.current;
    const end = e.changedTouches[0]?.clientX;
    touchX.current = null;
    if (start == null || end == null) return;
    const delta = end - start;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) setPage((p) => Math.min(total || p, p + 1));
    else setPage((p) => Math.max(1, p - 1));
  }

  if (error) {
    return (
      <div className="tool-panel">
        <p className="feedback-toast error">{error}</p>
        <p className="tool-note">
          If you are on a phone, refresh the page on Wi‑Fi and open the book again.
        </p>
        <Link href={`/courses/${id}`} className="tool-btn">
          {c.details}
        </Link>
        <Link href="/courses" className="tool-btn" style={{ marginInlineStart: 8 }}>
          {c.backLibrary}
        </Link>
      </div>
    );
  }

  return (
    <div className="book-reader" ref={wrapRef}>
      <header className="tool-hero book-reader-hero">
        <div className="tool-kicker">{c.readerKicker}</div>
        <h1>{title || '…'}</h1>
        <p className="tool-lead book-reader-notice">
          Read-only · No download · Swipe left/right on phones to change pages
        </p>
      </header>

      <div className="book-reader-toolbar tool-input-row">
        <Link href={`/courses/${id}`} className="tool-btn">
          {c.details}
        </Link>
        <Link href="/courses" className="tool-btn">
          {c.backLibrary}
        </Link>
        <button
          type="button"
          className="tool-btn book-nav-btn"
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          ← Prev
        </button>
        <span className="book-page-indicator">{total ? `${page} / ${total}` : '…'}</span>
        <button
          type="button"
          className="tool-btn book-nav-btn"
          disabled={!total || page >= total || loading}
          onClick={() => setPage((p) => Math.min(total, p + 1))}
        >
          Next →
        </button>
        <button
          type="button"
          className="tool-btn book-nav-btn"
          aria-label="Zoom out"
          onClick={() => setZoom((z) => Math.max(0.7, Number((z - 0.15).toFixed(2))))}
        >
          −
        </button>
        <button
          type="button"
          className="tool-btn book-nav-btn"
          aria-label="Zoom in"
          onClick={() => setZoom((z) => Math.min(2.4, Number((z + 0.15).toFixed(2))))}
        >
          +
        </button>
      </div>

      <div
        className="book-stage"
        ref={stageRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {loading && (
          <p className="tool-note book-stage-status">
            <span className="loading-dot" />
            Opening book on your device…
          </p>
        )}
        {renderError && <p className="feedback-toast error book-stage-status">{renderError}</p>}
        <canvas ref={canvasRef} className="book-canvas" />
        <div className="book-watermark" aria-hidden>
          RojTech · Read only
        </div>
      </div>

      <div className="book-mobile-hint">
        {isMobileViewport()
          ? 'Tip: rotate your phone or use + / − if text looks small. Swipe to turn pages.'
          : 'Use Prev / Next or zoom controls to read comfortably.'}
      </div>
    </div>
  );
}
