import AppShell from '@/components/AppShell';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <AppShell showFooter={false}>
      <Hero />
    </AppShell>
  );
}
