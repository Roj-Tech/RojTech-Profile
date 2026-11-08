import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';
import PageFrame from '@/components/PageFrame';
import Team from '@/components/Team';

export const metadata: Metadata = {
  title: 'Team — RojTech',
};

export default function TeamPage() {
  return (
    <AppShell>
      <PageFrame>
        <Team />
      </PageFrame>
    </AppShell>
  );
}
