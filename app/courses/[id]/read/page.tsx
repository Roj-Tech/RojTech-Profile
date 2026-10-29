import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PdfReader from '@/components/courses/PdfReader';
import { getCourse } from '@/lib/courses/store';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const course = getCourse(id);
  return {
    title: course ? `Read ${course.title} — RojTech` : 'Read PDF — RojTech',
  };
}

export default async function CourseReadPage({ params }: Props) {
  const { id } = await params;
  const course = getCourse(id);
  if (!course || !course.published) notFound();
  return <PdfReader id={id} title={course.title} />;
}
