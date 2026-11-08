'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import CustomCursor from '@/components/CustomCursor';
import Nav from '@/components/Nav';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';

export default function AppShell({
  children,
  showFooter = true,
}: {
  children: React.ReactNode;
  showFooter?: boolean;
}) {
  useScrollReveal();

  return (
    <>
      <CustomCursor />
      <Nav />
      <div className="app-shell-main">{children}</div>
      {showFooter ? <Footer /> : null}
      <BottomNav />
    </>
  );
}
