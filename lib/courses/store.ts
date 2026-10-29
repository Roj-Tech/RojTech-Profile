import { randomUUID } from 'crypto';
import { existsSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'fs';
import { DEFAULT_CATEGORIES } from './categories';
import { COURSES_DB_PATH, ensureDataDirs, safeUploadPath } from './paths';
import type { CourseCategory, CourseResource, CoursesDatabase, Difficulty, PublicCourse } from './types';

function emptyDb(): CoursesDatabase {
  return { categories: [...DEFAULT_CATEGORIES], courses: [] };
}

const SEEDED_JAVA_BOOK: CourseResource = {
  id: 'java-kurdish-rojtech',
  title: 'Java Kurdish Book - Team RojTech',
  description:
    'A Kurdish-language Java teaching book by Team RojTech. Read online only. Downloads are disabled.',
  categoryId: 'java',
  subject: 'Java / Kurdish',
  difficulty: 'Beginner',
  author: 'Team RojTech',
  pdfFile: 'java-kurdish-rojtech.pdf',
  pdfOriginalName: 'Java_Kurdish_Book_Team_Rojtech.pdf',
  published: true,
  allowDownload: false,
  createdAt: '2026-04-29T00:00:00.000Z',
  updatedAt: '2026-04-29T00:00:00.000Z',
  createdBy: 'system',
};

function ensureSeededBooks(db: CoursesDatabase) {
  if (!db.courses.some((c) => c.id === SEEDED_JAVA_BOOK.id)) {
    // Prefer published seed at the front of the shelf
    db.courses.unshift({ ...SEEDED_JAVA_BOOK });
    writeDb(db);
  }
}

export function readDb(): CoursesDatabase {
  ensureDataDirs();
  if (!existsSync(COURSES_DB_PATH)) {
    const db = emptyDb();
    db.courses.push({ ...SEEDED_JAVA_BOOK });
    writeDb(db);
    return db;
  }
  try {
    const raw = readFileSync(COURSES_DB_PATH, 'utf8');
    const parsed = JSON.parse(raw) as CoursesDatabase;
    if (!parsed.categories?.length) parsed.categories = [...DEFAULT_CATEGORIES];
    if (!Array.isArray(parsed.courses)) parsed.courses = [];
    ensureSeededBooks(parsed);
    return parsed;
  } catch {
    const db = emptyDb();
    db.courses.push({ ...SEEDED_JAVA_BOOK });
    return db;
  }
}

export function writeDb(db: CoursesDatabase) {
  ensureDataDirs();
  const tmp = `${COURSES_DB_PATH}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf8');
  renameSync(tmp, COURSES_DB_PATH);
}

export function toPublicCourse(course: CourseResource): PublicCourse {
  const { pdfFile: _pdf, coverFile, createdBy: _by, ...rest } = course;
  return { ...rest, hasCover: Boolean(coverFile) };
}

export function listCourses(opts?: { publishedOnly?: boolean }) {
  const db = readDb();
  let courses = db.courses;
  if (opts?.publishedOnly) courses = courses.filter((c) => c.published);
  return courses;
}

export function getCourse(id: string) {
  return readDb().courses.find((c) => c.id === id) ?? null;
}

export function listCategories() {
  return readDb().categories;
}

export function addCategory(name: string) {
  const db = readDb();
  const id = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || randomUUID();
  if (db.categories.some((c) => c.id === id || c.name.toLowerCase() === name.toLowerCase())) {
    throw new Error('Category already exists');
  }
  const category: CourseCategory = { id, name: name.trim() };
  db.categories.push(category);
  writeDb(db);
  return category;
}

export type CreateCourseInput = {
  title: string;
  description: string;
  categoryId: string;
  subject: string;
  difficulty: Difficulty;
  author?: string;
  published: boolean;
  allowDownload: boolean;
  pdfFile: string;
  pdfOriginalName: string;
  coverFile?: string;
  createdBy: string;
};

export function createCourse(input: CreateCourseInput) {
  const db = readDb();
  if (!db.categories.some((c) => c.id === input.categoryId)) {
    throw new Error('Invalid category');
  }
  const now = new Date().toISOString();
  const course: CourseResource = {
    id: randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    categoryId: input.categoryId,
    subject: input.subject.trim(),
    difficulty: input.difficulty,
    author: input.author?.trim() || undefined,
    coverFile: input.coverFile,
    pdfFile: input.pdfFile,
    pdfOriginalName: input.pdfOriginalName,
    published: input.published,
    allowDownload: input.allowDownload,
    createdAt: now,
    updatedAt: now,
    createdBy: input.createdBy,
  };
  db.courses.unshift(course);
  writeDb(db);
  return course;
}

export function updateCourse(
  id: string,
  patch: Partial<Omit<CourseResource, 'id' | 'createdAt' | 'createdBy'>>,
) {
  const db = readDb();
  const idx = db.courses.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  const prev = db.courses[idx];
  const next: CourseResource = {
    ...prev,
    ...patch,
    id: prev.id,
    createdAt: prev.createdAt,
    createdBy: prev.createdBy,
    updatedAt: new Date().toISOString(),
  };
  db.courses[idx] = next;
  writeDb(db);
  return next;
}

function tryUnlink(file?: string) {
  if (!file) return;
  try {
    unlinkSync(safeUploadPath(file));
  } catch {
    /* ignore missing */
  }
}

export function deleteCourse(id: string) {
  const db = readDb();
  const idx = db.courses.findIndex((c) => c.id === id);
  if (idx < 0) return false;
  const [removed] = db.courses.splice(idx, 1);
  writeDb(db);
  tryUnlink(removed.pdfFile);
  tryUnlink(removed.coverFile);
  return true;
}

export function filterPublicCourses(query: {
  search?: string;
  category?: string;
  subject?: string;
  difficulty?: string;
  sort?: string;
}) {
  let courses = listCourses({ publishedOnly: true }).map(toPublicCourse);
  const q = query.search?.trim().toLowerCase();
  if (q) {
    courses = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.author || '').toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q),
    );
  }
  if (query.category) courses = courses.filter((c) => c.categoryId === query.category);
  if (query.subject) {
    const s = query.subject.toLowerCase();
    courses = courses.filter((c) => c.subject.toLowerCase().includes(s));
  }
  if (query.difficulty) courses = courses.filter((c) => c.difficulty === query.difficulty);
  if (query.sort === 'title') {
    courses.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    courses.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return courses;
}
