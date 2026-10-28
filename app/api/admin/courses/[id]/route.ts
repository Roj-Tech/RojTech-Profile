import { randomUUID } from 'crypto';
import { unlinkSync, writeFileSync } from 'fs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/courses/auth';
import { ensureDataDirs, safeUploadPath } from '@/lib/courses/paths';
import { deleteCourse, getCourse, toPublicCourse, updateCourse } from '@/lib/courses/store';
import type { Difficulty } from '@/lib/courses/types';
import {
  DEFAULT_MAX_COVER_BYTES,
  detectCoverExt,
  getMaxUploadBytes,
  isPdfBuffer,
} from '@/lib/courses/validatePdf';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const existing = getCourse(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const form = await request.formData();
  const patch: Parameters<typeof updateCourse>[1] = {};

  if (form.has('title')) patch.title = String(form.get('title') || '').trim();
  if (form.has('description')) patch.description = String(form.get('description') || '').trim();
  if (form.has('categoryId')) patch.categoryId = String(form.get('categoryId') || '').trim();
  if (form.has('subject')) patch.subject = String(form.get('subject') || '').trim();
  if (form.has('author')) {
    const author = String(form.get('author') || '').trim();
    patch.author = author || undefined;
  }
  if (form.has('difficulty')) {
    const difficulty = String(form.get('difficulty') || '') as Difficulty;
    if (!['Beginner', 'Intermediate', 'Advanced'].includes(difficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 });
    }
    patch.difficulty = difficulty;
  }
  if (form.has('published')) patch.published = String(form.get('published')) === 'true';
  if (form.has('allowDownload')) patch.allowDownload = String(form.get('allowDownload')) === 'true';

  ensureDataDirs();
  const pdf = form.get('pdf');
  if (pdf instanceof File && pdf.size > 0) {
    if (pdf.size > getMaxUploadBytes()) {
      return NextResponse.json({ error: 'PDF too large' }, { status: 400 });
    }
    const pdfBuf = Buffer.from(await pdf.arrayBuffer());
    if (!isPdfBuffer(pdfBuf)) {
      return NextResponse.json({ error: 'File is not a valid PDF' }, { status: 400 });
    }
    const pdfFile = `${randomUUID()}.pdf`;
    writeFileSync(safeUploadPath(pdfFile), pdfBuf);
    try {
      unlinkSync(safeUploadPath(existing.pdfFile));
    } catch {
      /* ignore */
    }
    patch.pdfFile = pdfFile;
    patch.pdfOriginalName = pdf.name.replace(/[^\w.\- ()[\]]+/g, '_') || existing.pdfOriginalName;
  }

  const cover = form.get('cover');
  if (cover instanceof File && cover.size > 0) {
    if (cover.size > DEFAULT_MAX_COVER_BYTES) {
      return NextResponse.json({ error: 'Cover too large' }, { status: 400 });
    }
    const coverBuf = Buffer.from(await cover.arrayBuffer());
    const ext = detectCoverExt(coverBuf);
    if (!ext) return NextResponse.json({ error: 'Cover must be JPEG or PNG' }, { status: 400 });
    const coverFile = `${randomUUID()}.${ext}`;
    writeFileSync(safeUploadPath(coverFile), coverBuf);
    if (existing.coverFile) {
      try {
        unlinkSync(safeUploadPath(existing.coverFile));
      } catch {
        /* ignore */
      }
    }
    patch.coverFile = coverFile;
  }

  const updated = updateCourse(id, patch);
  return NextResponse.json({ course: updated ? toPublicCourse(updated) : null });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await ctx.params;
  const ok = deleteCourse(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
