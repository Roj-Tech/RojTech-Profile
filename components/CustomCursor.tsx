'use client';

import { useCustomCursor } from '@/hooks/useCustomCursor';

export default function CustomCursor() {
  const { cursorRef, ringRef } = useCustomCursor();

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
