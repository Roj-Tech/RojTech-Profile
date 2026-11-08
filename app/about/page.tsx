import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';
import PageFrame from '@/components/PageFrame';
import About from '@/components/About';

export const metadata: Metadata = {
  title: 'About — RojTech',
};

export default function AboutPage() {
  return (
    <AppShell>
      <PageFrame>
        <About />
      </PageFrame>
    </AppShell>
  );
}
