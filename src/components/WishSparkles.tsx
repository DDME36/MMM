import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { CONFIG } from '../config';

// Adapted from Magic UI's Confetti / Stars example; scoped canvas and finite lifetime.
// https://magicui.design/docs/components/confetti
export function WishSparkles({ onComplete }: { onComplete: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvas.current) return;
    const fire = confetti.create(canvas.current, { resize: true, useWorker: true });
    const burst = () => {
      for (const x of [.12, .88]) fire({
        particleCount: 18, spread: 360, ticks: 150, gravity: .12,
        decay: .96, startVelocity: 12, scalar: .8, shapes: ['star', 'circle'],
        colors: CONFIG.theme.confetti, origin: { x, y: .55 },
      });
    };
    const first = window.setTimeout(burst, 350);
    const second = window.setTimeout(burst, 700);
    const end = window.setTimeout(onComplete, CONFIG.motion.wishSparklesMs);
    return () => {
      window.clearTimeout(first); window.clearTimeout(second); window.clearTimeout(end);
      fire.reset();
    };
  }, [onComplete]);
  return createPortal(<canvas ref={canvas} className="wish-sparkles" aria-hidden="true" />, document.body);
}
