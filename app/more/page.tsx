import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';
import PageFrame from '@/components/PageFrame';
import MorePage from '@/components/MorePage';

export const metadata: Metadata = {
  title: 'More — RojTech',
};

export default function MoreRoutePage() {
  return (
    <AppShell>
      <PageFrame>
        <MorePage />
      </PageFrame>
    </AppShell>
  );
}
