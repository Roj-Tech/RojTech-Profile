import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';
import PageFrame from '@/components/PageFrame';
import Projects from '@/components/Projects';

export const metadata: Metadata = {
  title: 'Projects — RojTech',
};

export default function ProjectsPage() {
  return (
    <AppShell>
      <PageFrame>
        <Projects />
      </PageFrame>
    </AppShell>
  );
}
