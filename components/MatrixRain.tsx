'use client';

import { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CHARS =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]|/\\!@#$%^&*';
    const FONT_SIZE = 14;
    let columns = 0;
    let drops: number[] = [];
    let intervalId: ReturnType<typeof setInterval>;

    const resize = () => {
      const hero = document.getElementById('hero');
      if (!hero) return;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
      columns = Math.floor(canvas.width / FONT_SIZE);
      drops = Array.from({ length: columns }, () => (Math.random() * -canvas.height) / FONT_SIZE);
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 11, 20, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px "Share Tech Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const y = drops[i] * FONT_SIZE;

        if (drops[i] > 0) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#00f5ff';
          ctx.fillStyle = '#e0ffff';
          ctx.fillText(char, i * FONT_SIZE, y);
        }

        const trailChar = CHARS[Math.floor(Math.random() * CHARS.length)];
        const fade = Math.random();
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#00ff88';
        ctx.fillStyle =
          fade > 0.92
            ? 'rgba(0, 245, 255, 0.9)'
            : `rgba(0, ${Math.floor(180 + fade * 75)}, ${Math.floor(fade * 80)}, ${0.5 + fade * 0.4})`;
        ctx.fillText(trailChar, i * FONT_SIZE, y - FONT_SIZE);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = Math.random() * -20;
        }
        drops[i] += 0.5;
      }

      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    };

    window.addEventListener('resize', resize);
    resize();
    intervalId = setInterval(draw, 40);

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(intervalId);
    };
  }, []);

  return <canvas id="matrix-canvas" ref={canvasRef} />;
}
