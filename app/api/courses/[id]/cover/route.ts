import { existsSync, readFileSync } from 'fs';
import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/courses/auth';
import { safeUploadPath } from '@/lib/courses/paths';
import { getCourse } from '@/lib/courses/store';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const course = getCourse(id);
  if (!course?.coverFile) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const session = await getAdminSession();
  if (!course.published && !session) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const filePath = safeUploadPath(course.coverFile);
  if (!existsSync(filePath)) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const buf = readFileSync(filePath);
  const type = course.coverFile.endsWith('.png') ? 'image/png' : 'image/jpeg';
  return new NextResponse(buf, {
    headers: {
      'Content-Type': type,
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
