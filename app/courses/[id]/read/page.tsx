import { redirect } from 'next/navigation';
import { getCourse } from '@/lib/courses/store';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

/** Send every device straight to the image-based phone reader. */
export default async function CourseReadPage({ params }: Props) {
  const { id } = await params;
  const course = getCourse(id);
  if (!course || !course.published) notFound();
  redirect(`/book-viewer.html?id=${encodeURIComponent(id)}`);
}
