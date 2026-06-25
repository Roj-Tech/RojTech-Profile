'use client';

import { useEffect, useRef } from 'react';

export function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const mobileQuery = window.matchMedia('(max-width: 768px)');
    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let ringRunning = false;
    let rafId = 0;

    const isMobile = () => mobileQuery.matches;

    const onMove = (e: MouseEvent) => {
      if (isMobile()) return;
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = `${mx}px`;
      cursor.style.top = `${my}px`;
    };

    const animateRing = () => {
      if (!ringRunning) return;
      if (!isMobile()) {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = `${rx}px`;
        ring.style.top = `${ry}px`;
      }
      rafId = requestAnimationFrame(animateRing);
    };

    const startCursor = () => {
      if (isMobile()) return;
      if (!ringRunning) {
        ringRunning = true;
        animateRing();
      }
    };

    const stopCursor = () => {
      ringRunning = false;
      cancelAnimationFrame(rafId);
    };

    const onEnter = () => {
      if (isMobile()) return;
      cursor.style.width = '16px';
      cursor.style.height = '16px';
      ring.style.width = '48px';
      ring.style.height = '48px';
      ring.style.borderColor = 'rgba(0,245,255,0.8)';
    };

    const onLeave = () => {
      if (isMobile()) return;
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'rgba(0,245,255,0.5)';
    };

    const interactive = document.querySelectorAll('a, button, .learn-card');
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    document.addEventListener('mousemove', onMove);

    const onMediaChange = () => {
      if (isMobile()) stopCursor();
      else startCursor();
    };

    mobileQuery.addEventListener('change', onMediaChange);
    if (!isMobile()) startCursor();

    return () => {
      document.removeEventListener('mousemove', onMove);
      mobileQuery.removeEventListener('change', onMediaChange);
      interactive.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      stopCursor();
    };
  }, []);

  return { cursorRef, ringRef };
}
