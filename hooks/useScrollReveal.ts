'use client';

import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.1 },
    );
    reveals.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function useHeroReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('#hero .reveal');
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 150);
    });
  }, []);
}
