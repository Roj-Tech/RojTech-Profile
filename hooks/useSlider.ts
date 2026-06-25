'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type UseSliderOptions = {
  total: number;
  autoInterval?: number;
  onBoxClick?: () => void;
  dotClass?: string;
};

export function useSlider({ total, autoInterval, onBoxClick, dotClass = 'dot' }: UseSliderOptions) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchXRef = useRef<number | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      setCurrent((idx + total) % total);
    },
    [total],
  );

  const stopAuto = useCallback(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const startAuto = useCallback(() => {
    if (!autoInterval) return;
    stopAuto();
    autoTimerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, autoInterval);
  }, [autoInterval, stopAuto, total]);

  const resetAuto = useCallback(() => {
    stopAuto();
    startAuto();
  }, [startAuto, stopAuto]);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${current * 100}%)`;
    }
  }, [current]);

  useEffect(() => {
    if (autoInterval) startAuto();
    return stopAuto;
  }, [autoInterval, startAuto, stopAuto]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onTouchStart = (e: TouchEvent) => {
      touchXRef.current = e.touches[0].clientX;
      if (autoInterval) stopAuto();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchXRef.current === null) return;
      const diff = touchXRef.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        setCurrent((c) => (c + (diff > 0 ? 1 : -1) + total) % total);
      }
      touchXRef.current = null;
      if (autoInterval) startAuto();
    };

    track.addEventListener('touchstart', onTouchStart, { passive: true });
    track.addEventListener('touchend', onTouchEnd);

    return () => {
      track.removeEventListener('touchstart', onTouchStart);
      track.removeEventListener('touchend', onTouchEnd);
    };
  }, [autoInterval, startAuto, stopAuto, total]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || !onBoxClick) return;

    const onClick = () => onBoxClick();
    const onEnter = () => stopAuto();
    const onLeave = () => startAuto();

    box.addEventListener('click', onClick);
    if (autoInterval) {
      box.addEventListener('mouseenter', onEnter);
      box.addEventListener('mouseleave', onLeave);
    }

    return () => {
      box.removeEventListener('click', onClick);
      if (autoInterval) {
        box.removeEventListener('mouseenter', onEnter);
        box.removeEventListener('mouseleave', onLeave);
      }
    };
  }, [autoInterval, onBoxClick, startAuto, stopAuto]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [current, goTo]);

  return {
    current,
    goTo,
    trackRef,
    boxRef,
    resetAuto,
    dotClass,
  };
}
