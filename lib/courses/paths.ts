import { mkdirSync } from 'fs';
import path from 'path';

export const DATA_DIR = path.join(process.cwd(), 'data');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
export const COURSES_DB_PATH = path.join(DATA_DIR, 'courses.json');

export function ensureDataDirs() {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function safeUploadPath(filename: string) {
  const base = path.basename(filename);
  const full = path.join(UPLOADS_DIR, base);
  if (!full.startsWith(UPLOADS_DIR)) {
    throw new Error('Invalid upload path');
  }
  return full;
}
