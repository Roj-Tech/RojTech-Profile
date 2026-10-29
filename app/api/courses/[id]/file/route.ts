import { existsSync, readFileSync } from 'fs';
import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/courses/auth';
import { safeUploadPath } from '@/lib/courses/paths';
import { getCourse } from '@/lib/courses/store';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const course = getCourse(id);
  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const session = await getAdminSession();
  if (!course.published && !session) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const wantDownload = searchParams.get('download') === '1';

  // Public download is never allowed when the course disables it
  if (wantDownload) {
    if (!course.allowDownload) {
      return NextResponse.json(
        { error: 'Downloads are disabled for this book. Read online only.' },
        { status: 403 },
      );
    }
  }

  const filePath = safeUploadPath(course.pdfFile);
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'File missing' }, { status: 404 });
  }

  const buf = readFileSync(filePath);
  const canAttach = wantDownload && course.allowDownload;
  const disposition = canAttach
    ? `attachment; filename="${course.pdfOriginalName.replace(/"/g, '')}"`
    : 'inline';

  return new NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(buf.length),
      'Content-Disposition': disposition,
      'Cache-Control': 'private, no-store, no-cache, must-revalidate',
      Pragma: 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      // Discourage embedding / casual saving outside the reader
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': "frame-ancestors 'self'",
    },
  });
}
