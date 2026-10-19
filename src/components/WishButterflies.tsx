import { useEffect, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { CONFIG } from '../config';
import './WishButterflies.css';

// Flight lanes stay near the edges so the wishes remain readable.
const FLIGHTS = [
  { x: [8, 12, 5, 11, 6], y: [102, 77, 52, 26, -12], turn: [-18, 15, -12, 20, -8], size: 64, delay: 0 },
  { x: [92, 87, 95, 89, 96], y: [102, 78, 48, 27, -12], turn: [20, -15, 16, -18, 12], size: 73, delay: .2 },
  { x: [3, 8, 4, 12, 7], y: [81, 64, 43, 21, -14], turn: [-15, 17, -20, 8, -14], size: 43, delay: .7 },
  { x: [97, 92, 97, 90, 94], y: [82, 63, 42, 19, -14], turn: [12, -20, 15, -12, 18], size: 48, delay: .9 },
  { x: [13, 7, 14, 6, 12], y: [106, 86, 60, 37, -12], turn: [15, -18, 14, -10, 18], size: 55, delay: 1.2 },
  { x: [87, 95, 88, 96, 89], y: [106, 85, 63, 35, -12], turn: [-17, 12, -14, 16, -10], size: 58, delay: 1.4 },
];

export function WishButterflies({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Remove the entire overlay after the final flight; there are no persistent loops.
    const lastDelay = .65 + Math.max(...FLIGHTS.map(flight => flight.delay));
    const timer = window.setTimeout(onComplete, CONFIG.motion.butterflyFlightMs + lastDelay * 1000 + 100);
    return () => window.clearTimeout(timer);
  }, [onComplete]);
  return createPortal(<div className="wish-butterfly-overlay" aria-hidden="true">
    {FLIGHTS.map((flight, index) => <motion.span key={index} className="wish-butterfly-flight" style={{ '--butterfly-size': `${flight.size}px`, '--wing-beat': `${CONFIG.motion.butterflyFlapMs + index * 35}ms` } as CSSProperties}
      initial={{ x: `${flight.x[0]}vw`, y: `${flight.y[0]}dvh`, opacity: 0 }}
      animate={{ x: flight.x.map(x => `${x}vw`), y: flight.y.map(y => `${y}dvh`), rotate: flight.turn, opacity: [0, .95, .9, .85, 0] }}
      transition={{ duration: CONFIG.motion.butterflyFlightMs / 1000, delay: .65 + flight.delay, ease: 'easeInOut', times: [0, .2, .48, .76, 1] }}>
      <span className="wish-butterfly-sprite">
        <img className="wish-butterfly-wing butterfly-wing-left" src={CONFIG.secrets.butterflyImage} alt="" draggable={false} />
        <img className="wish-butterfly-wing butterfly-wing-right" src={CONFIG.secrets.butterflyImage} alt="" draggable={false} />
      </span>
    </motion.span>)}
  </div>, document.body);
}
