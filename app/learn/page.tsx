import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';
import PageFrame from '@/components/PageFrame';
import LearnSection from '@/components/LearnSection';

export const metadata: Metadata = {
  title: 'Learn — RojTech',
};

export default function LearnPage() {
  return (
    <AppShell>
      <PageFrame>
        <LearnSection />
      </PageFrame>
    </AppShell>
  );
}
