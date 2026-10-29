import type { Metadata } from 'next';
import CoursesLibrary from '@/components/courses/CoursesLibrary';
import { filterPublicCourses, listCategories } from '@/lib/courses/store';

export const metadata: Metadata = {
  title: 'Courses Library — RojTech',
  description: 'Browse published RojTech PDF learning resources.',
};

export const dynamic = 'force-dynamic';

export default function CoursesPage() {
  const initialData = {
    courses: filterPublicCourses({ sort: 'newest' }),
    categories: listCategories(),
  };

  return <CoursesLibrary initialData={initialData} />;
}
