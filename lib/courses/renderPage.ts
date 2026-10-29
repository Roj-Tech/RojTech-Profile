/**
 * Book pages are pre-rendered to `public/book-pages/<courseId>/p-N.jpg`
 * by `scripts/render-book-pages.cjs` (uses pdf.js + @napi-rs/canvas).
 * Runtime serving is static files / thin API wrappers — no live PDF render.
 */
export {};
