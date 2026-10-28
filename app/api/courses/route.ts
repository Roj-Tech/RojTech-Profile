import { NextResponse } from 'next/server';
import { filterPublicCourses, listCategories } from '@/lib/courses/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courses = filterPublicCourses({
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    subject: searchParams.get('subject') || undefined,
    difficulty: searchParams.get('difficulty') || undefined,
    sort: searchParams.get('sort') || 'newest',
  });
  return NextResponse.json({ courses, categories: listCategories() });
}
