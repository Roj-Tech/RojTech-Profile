import type { Metadata } from 'next';
import CoursesLibrary from '@/components/courses/CoursesLibrary';

export const metadata: Metadata = {
  title: 'Courses Library — RojTech',
  description: 'Browse published RojTech PDF learning resources.',
};

export default function CoursesPage() {
  return <CoursesLibrary />;
}
