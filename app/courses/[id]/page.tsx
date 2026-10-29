import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CourseDetails from '@/components/courses/CourseDetails';
import { getCourse, toPublicCourse } from '@/lib/courses/store';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const course = getCourse(id);
  if (!course || !course.published) {
    return { title: 'Course details — RojTech' };
  }
  return {
    title: `${course.title} — RojTech`,
    description: course.description,
  };
}

export default async function CourseDetailsPage({ params }: Props) {
  const { id } = await params;
  const course = getCourse(id);
  if (!course || !course.published) {
    notFound();
  }

  return <CourseDetails course={toPublicCourse(course)} />;
}
