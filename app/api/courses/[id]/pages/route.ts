import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { getCourse } from '@/lib/courses/store';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

/** Page count from pre-rendered book images (phone-safe). */
export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const course = getCourse(id);
  if (!course || !course.published) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const metaPath = path.join(process.cwd(), 'public', 'book-pages', id, 'meta.json');
  if (!existsSync(metaPath)) {
    return NextResponse.json({ error: 'Book pages not prepared' }, { status: 404 });
  }

  const meta = JSON.parse(readFileSync(metaPath, 'utf8')) as {
    id: string;
    title: string;
    pages: number;
  };

  return NextResponse.json({
    id: course.id,
    title: meta.title || course.title,
    pages: meta.pages,
  });
}
