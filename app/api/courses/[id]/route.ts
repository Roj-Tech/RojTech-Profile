import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/courses/auth';
import { getCourse, listCategories, toPublicCourse } from '@/lib/courses/store';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const course = getCourse(id);
  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const session = await getAdminSession();
  if (!course.published && !session) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const category = listCategories().find((c) => c.id === course.categoryId);
  return NextResponse.json({
    course: session ? course : toPublicCourse(course),
    categoryName: category?.name || course.categoryId,
  });
}
