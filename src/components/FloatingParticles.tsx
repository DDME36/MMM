import type { CSSProperties } from 'react';
import { Sparkle } from 'lucide-react';
import { CONFIG } from '../config';

export function FloatingParticles() {
  return <div className="floating-particles" aria-hidden="true">{Array.from({ length: Math.max(0, Math.min(40, CONFIG.motion.particles)) }, (_, i) => <span key={i} className={i % 4 === 0 ? 'particle-star' : 'particle-bokeh'} style={{ left: `${(i * 37 + 7) % 100}%`, top: `${(i * 23 + 13) % 100}%`, '--particle-time': `${12 + i % 7}s`, '--particle-delay': `${-i * 1.7}s`, '--particle-size': `${i % 4 === 0 ? 16 : 4 + i % 6}px` } as CSSProperties}>{i % 4 === 0 && <Sparkle size={16} strokeWidth={1} />}</span>)}</div>;
}
