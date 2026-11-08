import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';
import PageFrame from '@/components/PageFrame';
import CTA from '@/components/CTA';

export const metadata: Metadata = {
  title: 'Connect — RojTech',
};

export default function ConnectPage() {
  return (
    <AppShell>
      <PageFrame>
        <CTA />
      </PageFrame>
    </AppShell>
  );
}
