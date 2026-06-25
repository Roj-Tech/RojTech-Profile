'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import { LocaleProvider } from '@/contexts/LocaleContext';
import CustomCursor from '@/components/CustomCursor';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Team from '@/components/Team';
import LearnSection from '@/components/LearnSection';
import CTA from '@/components/CTA';
import Upcoming from '@/components/Upcoming';
import Footer from '@/components/Footer';

function SiteContent() {
  useScrollReveal();

  return (
    <>
      <CustomCursor />
      <Nav />
      <Hero />
      <About />
      <Team />
      <LearnSection />
      <CTA />
      <Upcoming />
      <Footer />
    </>
  );
}

export default function SitePage() {
  return (
    <LocaleProvider>
      <SiteContent />
    </LocaleProvider>
  );
}
