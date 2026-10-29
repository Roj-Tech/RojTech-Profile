'use strict';

/**
 * One-shot: render a course PDF into public/book-pages/<id>/p-N.jpg
 * Usage: node scripts/render-book-pages.cjs [courseId]
 */
const fs = require('fs');
const path = require('path');
const { createCanvas, DOMMatrix, ImageData, Path2D } = require('@napi-rs/canvas');
const Module = require('module');
const orig = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'canvas') return require('@napi-rs/canvas');
  return orig.apply(this, arguments);
};
global.DOMMatrix = DOMMatrix;
global.Path2D = Path2D;
global.ImageData = ImageData;

const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
const courseId = process.argv[2] || 'java-kurdish-rojtech';
const db = JSON.parse(fs.readFileSync(path.join('data', 'courses.json'), 'utf8'));
const course = (db.courses || []).find((c) => c.id === courseId);
if (!course) {
  console.error('Course not found:', courseId);
  process.exit(1);
}

const pdfPath = path.join('data', 'uploads', path.basename(course.pdfFile));
const outDir = path.join('public', 'book-pages', courseId);
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs
    .getDocument({
      data,
      useSystemFonts: true,
      disableFontFace: true,
      isEvalSupported: false,
      disableWorker: true,
    })
    .promise;
  console.log('Rendering', doc.numPages, 'pages for', courseId);
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 1.25 });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    fs.writeFileSync(path.join(outDir, `p-${i}.jpg`), canvas.toBuffer('image/jpeg'));
    if (i % 10 === 0 || i === doc.numPages) console.log('done', i);
  }
  fs.writeFileSync(
    path.join(outDir, 'meta.json'),
    JSON.stringify({ id: courseId, title: course.title, pages: doc.numPages }, null, 2),
  );
  console.log('ALL DONE →', outDir);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
