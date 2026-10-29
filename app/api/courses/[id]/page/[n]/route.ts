import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { getCourse } from '@/lib/courses/store';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string; n: string }> };

/** Serve a pre-rendered JPEG page (no client PDF.js). */
export async function GET(_request: Request, ctx: Ctx) {
  const { id, n } = await ctx.params;
  const course = getCourse(id);
  if (!course || !course.published) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const pageNum = Number.parseInt(n, 10);
  if (!Number.isFinite(pageNum) || pageNum < 1) {
    return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
  }

  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '');
  const filePath = path.join(process.cwd(), 'public', 'book-pages', safeId, `p-${pageNum}.jpg`);
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'Page missing' }, { status: 404 });
  }

  const jpeg = readFileSync(filePath);
  return new NextResponse(jpeg, {
    status: 200,
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Length': String(jpeg.length),
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
