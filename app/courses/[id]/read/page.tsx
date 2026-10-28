import type { Metadata } from 'next';
import PdfReader from '@/components/courses/PdfReader';

export const metadata: Metadata = {
  title: 'Read PDF — RojTech',
};

type Props = { params: Promise<{ id: string }> };

export default async function CourseReadPage({ params }: Props) {
  const { id } = await params;
  return <PdfReader id={id} />;
}
