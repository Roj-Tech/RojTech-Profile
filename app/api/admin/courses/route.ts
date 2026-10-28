import { randomUUID } from 'crypto';
import { writeFileSync } from 'fs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/courses/auth';
import { ensureDataDirs, safeUploadPath } from '@/lib/courses/paths';
import { createCourse, listCategories, listCourses, toPublicCourse } from '@/lib/courses/store';
import type { Difficulty } from '@/lib/courses/types';
import {
  DEFAULT_MAX_COVER_BYTES,
  detectCoverExt,
  getMaxUploadBytes,
  isPdfBuffer,
} from '@/lib/courses/validatePdf';

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({
    courses: listCourses(),
    categories: listCategories(),
  });
}

export async function POST(request: Request) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await request.formData();
  const title = String(form.get('title') || '').trim();
  const description = String(form.get('description') || '').trim();
  const categoryId = String(form.get('categoryId') || '').trim();
  const subject = String(form.get('subject') || '').trim();
  const difficulty = String(form.get('difficulty') || '').trim() as Difficulty;
  const author = String(form.get('author') || '').trim();
  const published = String(form.get('published') || '') === 'true';
  const allowDownload = String(form.get('allowDownload') || 'true') !== 'false';
  const pdf = form.get('pdf');

  if (!title || !description || !categoryId || !subject) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!['Beginner', 'Intermediate', 'Advanced'].includes(difficulty)) {
    return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 });
  }
  if (!(pdf instanceof File)) {
    return NextResponse.json({ error: 'PDF file is required' }, { status: 400 });
  }

  const maxBytes = getMaxUploadBytes();
  if (pdf.size > maxBytes) {
    return NextResponse.json({ error: `PDF exceeds ${maxBytes} bytes` }, { status: 400 });
  }

  const pdfBuf = Buffer.from(await pdf.arrayBuffer());
  if (!isPdfBuffer(pdfBuf)) {
    return NextResponse.json({ error: 'File is not a valid PDF' }, { status: 400 });
  }

  ensureDataDirs();
  const pdfFile = `${randomUUID()}.pdf`;
  writeFileSync(safeUploadPath(pdfFile), pdfBuf);

  let coverFile: string | undefined;
  const cover = form.get('cover');
  if (cover instanceof File && cover.size > 0) {
    if (cover.size > DEFAULT_MAX_COVER_BYTES) {
      return NextResponse.json({ error: 'Cover image too large (max 2MB)' }, { status: 400 });
    }
    const coverBuf = Buffer.from(await cover.arrayBuffer());
    const ext = detectCoverExt(coverBuf);
    if (!ext) {
      return NextResponse.json({ error: 'Cover must be JPEG or PNG' }, { status: 400 });
    }
    coverFile = `${randomUUID()}.${ext}`;
    writeFileSync(safeUploadPath(coverFile), coverBuf);
  }

  try {
    const course = createCourse({
      title,
      description,
      categoryId,
      subject,
      difficulty,
      author: author || undefined,
      published,
      allowDownload,
      pdfFile,
      pdfOriginalName: pdf.name.replace(/[^\w.\- ()[\]]+/g, '_') || 'resource.pdf',
      coverFile,
      createdBy: session.username,
    });
    return NextResponse.json({ course: toPublicCourse(course) }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create course' },
      { status: 400 },
    );
  }
}
