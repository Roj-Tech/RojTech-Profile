import type { Metadata } from 'next';
import PageFrame from '@/components/PageFrame';
import Upcoming from '@/components/Upcoming';

export const metadata: Metadata = {
  title: 'Tools — RojTech',
};

export default function ToolsHubPage() {
  return (
    <PageFrame>
      <Upcoming />
    </PageFrame>
  );
}
