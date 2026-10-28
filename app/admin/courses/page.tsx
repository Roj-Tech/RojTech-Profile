import type { Metadata } from 'next';
import AdminCoursesDashboard from '@/components/courses/AdminCoursesDashboard';

export const metadata: Metadata = {
  title: 'Admin Courses — RojTech',
  robots: { index: false, follow: false },
};

export default function AdminCoursesPage() {
  return <AdminCoursesDashboard />;
}
