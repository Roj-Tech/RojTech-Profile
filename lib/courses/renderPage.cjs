'use strict';

const path = require('path');
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs');
const { createCanvas, DOMMatrix, ImageData, Path2D } = require('@napi-rs/canvas');

// pdf.js looks for package name "canvas"
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'canvas') return require('@napi-rs/canvas');
  return originalRequire.apply(this, arguments);
};

if (!global.DOMMatrix) global.DOMMatrix = DOMMatrix;
if (!global.Path2D) global.Path2D = Path2D;
if (!global.ImageData) global.ImageData = ImageData;

const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const COURSES_DB_PATH = path.join(DATA_DIR, 'courses.json');

const docCache = new Map();
const metaCache = new Map();

function readCourse(courseId) {
  if (!existsSync(COURSES_DB_PATH)) return null;
  const db = JSON.parse(readFileSync(COURSES_DB_PATH, 'utf8'));
  return (db.courses || []).find((c) => c.id === courseId) || null;
}

function pdfPath(filename) {
  return path.join(UPLOADS_DIR, path.basename(filename));
}

function pagesDir(courseId) {
  return path.join(UPLOADS_DIR, 'pages', String(courseId).replace(/[^a-zA-Z0-9_-]/g, ''));
}

function pageFile(courseId, page) {
  return path.join(pagesDir(courseId), `p-${page}.jpg`);
}

async function loadPdf(courseId) {
  if (docCache.has(courseId)) return docCache.get(courseId);

  const loading = (async () => {
    const course = readCourse(courseId);
    if (!course) throw new Error('Course not found');
    const filePath = pdfPath(course.pdfFile);
    if (!existsSync(filePath)) throw new Error('PDF missing');
    const data = new Uint8Array(readFileSync(filePath));
    const doc = await pdfjs.getDocument({
      data,
      useSystemFonts: true,
      disableFontFace: true,
      isEvalSupported: false,
      disableWorker: true,
    }).promise;
    metaCache.set(courseId, doc.numPages);
    return doc;
  })();

  docCache.set(courseId, loading);
  try {
    return await loading;
  } catch (err) {
    docCache.delete(courseId);
    throw err;
  }
}

async function getPageCount(courseId) {
  if (metaCache.has(courseId)) return metaCache.get(courseId);
  const doc = await loadPdf(courseId);
  return doc.numPages;
}

async function renderCoursePage(courseId, pageNum) {
  const course = readCourse(courseId);
  if (!course || !course.published) throw new Error('Course not found');

  const doc = await loadPdf(courseId);
  if (pageNum < 1 || pageNum > doc.numPages) throw new Error('Page out of range');

  const out = pageFile(courseId, pageNum);
  if (existsSync(out)) return readFileSync(out);

  mkdirSync(pagesDir(courseId), { recursive: true });

  const page = await doc.getPage(pageNum);
  const viewport = page.getViewport({ scale: 1.35 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;

  const jpeg = canvas.toBuffer('image/jpeg');
  writeFileSync(out, jpeg);
  return jpeg;
}

module.exports = { getPageCount, renderCoursePage };
