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
  if (wantDownload && !course.allowDownload && !session) {
    return NextResponse.json({ error: 'Downloads disabled for this resource' }, { status: 403 });
  }

  const filePath = safeUploadPath(course.pdfFile);
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'File missing' }, { status: 404 });
  }

  const buf = readFileSync(filePath);
  const disposition = wantDownload
    ? `attachment; filename="${course.pdfOriginalName.replace(/"/g, '')}"`
    : `inline; filename="${course.pdfOriginalName.replace(/"/g, '')}"`;

  return new NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(buf.length),
      'Content-Disposition': disposition,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
