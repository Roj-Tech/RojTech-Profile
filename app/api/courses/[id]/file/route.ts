import { existsSync, readFileSync } from 'fs';
import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/courses/auth';
import { safeUploadPath } from '@/lib/courses/paths';
import { getCourse } from '@/lib/courses/store';

type Ctx = { params: Promise<{ id: string }> };

/**
 * Raw PDF bytes — never for public readers when allowDownload is false.
 * The on-site reader uses rendered pages, not this file URL.
 */
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

  // Public users cannot fetch or download the PDF when downloads are off
  if (!course.allowDownload && !session) {
    return NextResponse.json(
      {
        error: 'Downloads are disabled. Open the book with Read PDF on RojTech to read online only.',
      },
      { status: 403 },
    );
  }

  if (wantDownload && !course.allowDownload) {
    return NextResponse.json(
      { error: 'Downloads are disabled for this book. Read online only.' },
      { status: 403 },
    );
  }

  const filePath = safeUploadPath(course.pdfFile);
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'File missing' }, { status: 404 });
  }

  const buf = readFileSync(filePath);
  const canAttach = wantDownload && course.allowDownload && Boolean(session);
  const disposition = canAttach
    ? `attachment; filename="${course.pdfOriginalName.replace(/"/g, '')}"`
    : 'inline';

  return new NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(buf.length),
      'Content-Disposition': disposition,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "frame-ancestors 'none'",
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
