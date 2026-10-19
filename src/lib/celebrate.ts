import confetti from 'canvas-confetti';
import { CONFIG } from '../config';

export function welcomeConfetti() {
  confetti({ particleCount: 95, spread: 85, startVelocity: 30, origin: { y: 0.65 }, colors: CONFIG.theme.confetti, zIndex: 100 });
}

/** A bounded fireworks sequence. The caller owns cancellation on unmount. */
export function birthdayFireworks() {
  const end = Date.now() + CONFIG.motion.fireworksMs;
  const burst = () => {
    const remaining = Math.max(0, (end - Date.now()) / Math.max(1, CONFIG.motion.fireworksMs));
    for (const x of [0.12, 0.88]) confetti({ particleCount: Math.ceil(25 * remaining), spread: 100, startVelocity: 32, ticks: 130, origin: { x, y: 0.15 + Math.random() * 0.3 }, colors: CONFIG.theme.confetti, zIndex: 100 });
  };
  burst();
  const timer = window.setInterval(() => { if (Date.now() >= end) window.clearInterval(timer); else burst(); }, 260);
  return () => window.clearInterval(timer);
}
