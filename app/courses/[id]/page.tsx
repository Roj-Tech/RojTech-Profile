import type { Metadata } from 'next';
import CourseDetails from '@/components/courses/CourseDetails';

export const metadata: Metadata = {
  title: 'Course details — RojTech',
};

type Props = { params: Promise<{ id: string }> };

export default async function CourseDetailsPage({ params }: Props) {
  const { id } = await params;
  return <CourseDetails id={id} />;
}
