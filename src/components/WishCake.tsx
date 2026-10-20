import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart } from 'lucide-react';
import { CONFIG } from '../config';
import { birthdayDate, graphemes } from '../lib/birthday';
import { birthdayFireworks } from '../lib/celebrate';
import { usePresentationMotion } from '../context/MotionPreference';

// Fixed wax outlines keep each wick attached to the numeral, independent of font metrics.
const CANDLE_SHAPES: Record<string, { path: string; wick: number }> = {
  '0': { path: 'M30 12 C8 12 8 76 30 76 C52 76 52 12 30 12', wick: 30 },
  '1': { path: 'M20 24 L32 12 V76 M18 76 H46', wick: 32 },
  '2': { path: 'M12 26 C12 7 48 7 48 26 C48 40 12 49 12 76 H48', wick: 30 },
  '3': { path: 'M13 17 C28 5 48 12 48 26 C48 37 39 42 28 42 C41 42 49 47 49 59 C49 78 26 83 12 71', wick: 30 },
  '4': { path: 'M38 76 V12 L10 54 H50', wick: 38 },
  '5': { path: 'M48 12 H14 V40 C23 33 48 36 48 56 C48 79 24 84 12 67', wick: 30 },
  '6': { path: 'M43 13 C17 11 9 48 14 65 C20 85 49 79 49 58 C49 37 24 33 14 53', wick: 39 },
  '7': { path: 'M10 12 H50 L23 76', wick: 30 },
  '8': { path: 'M30 42 C5 42 9 12 30 12 C51 12 55 42 30 42 C2 42 7 76 30 76 C53 76 58 42 30 42', wick: 30 },
  '9': { path: 'M46 43 C14 61 4 12 29 12 C55 12 49 60 18 76', wick: 30 },
};

function NumberCandle({ digit, blown }: { digit: string; blown: boolean }) {
  const shape = CANDLE_SHAPES[digit];
  return <span className="number-candle" aria-hidden="true">
    <span className="candle-stem" />
    <svg className="candle-digit" viewBox="0 0 60 92" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path className="candle-wax-shadow" d={shape.path} transform="translate(1 2)" />
      <path className="candle-wax" d={shape.path} />
      <path className="candle-wax-highlight" d={shape.path} transform="translate(-1 -1)" />
    </svg>
    <span className="candle-tip" style={{ left: `${shape.wick / 60 * 100}%` }}>
      <span className="candle-wick" />
      {!blown && <span className="candle-flame" />}
      {blown && <span className="candle-smoke"><i /><i /><i /></span>}
    </span>
  </span>;
}

export function TypewriterWish({ ready }: { ready: boolean }) {
  const letters = useMemo(() => graphemes(CONFIG.cake.mainWish), []);
  const [count, setCount] = useState(0);
  const { reduced } = usePresentationMotion();
  useEffect(() => {
    if (!ready || reduced) return;
    const timer = window.setInterval(() => setCount(value => { if (value >= letters.length) { window.clearInterval(timer); return value; } return value + 1; }), Math.max(8, CONFIG.motion.typewriterMs));
    return () => window.clearInterval(timer);
  }, [letters.length, reduced, ready]);
  const complete = reduced || count >= letters.length;
  return <motion.article className="exp-birthday-letter" initial={{ opacity: 0, y: reduced ? 0 : 25 }} animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 25 }} transition={{ duration: 0.65 }}>
    <div className="exp-letter-meta"><span>{CONFIG.cake.dedication}</span><span>{birthdayDate()}</span></div>
    <h3 id="birthday-letter-title">{CONFIG.cake.letterTitle}<Heart size={22} strokeWidth={1.2} /></h3>
    <p className="sr-only">{CONFIG.cake.mainWish}</p>
    <div className="typed-wish-layout" aria-hidden="true">
      <p className="typed-wish typed-wish-measure">{CONFIG.cake.mainWish}</p>
      <p className={`typed-wish ${complete ? 'is-complete' : ''}`}>{complete ? CONFIG.cake.mainWish : letters.slice(0, count).join('')}<span className="typewriter-caret" /></p>
    </div>
    <button type="button" className="read-whole-wish" style={{ visibility: ready && !complete ? 'visible' : 'hidden' }} disabled={!ready || complete} onClick={() => setCount(letters.length)}>{CONFIG.cake.showAll}</button>
    <div className="exp-letter-signoff"><span>{CONFIG.cake.signoff}</span><Heart size={19} fill="currentColor" /></div>
  </motion.article>;
}

export function BirthdayLetter({ ready }: { ready: boolean }) {
  const section = useRef<HTMLElement>(null);
  const visible = useInView(section, { amount: .1 });
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!visible || settled || ready) return;
    let timer = 0;
    // Also supports a manually reached letter after an interrupted automatic scroll.
    const check = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const rect = section.current?.getBoundingClientRect();
        if (rect && rect.top < innerHeight * .3 && rect.bottom > 100) setSettled(true);
      }, 180);
    };
    check(); window.addEventListener('scroll', check, { passive: true });
    return () => { window.clearTimeout(timer); window.removeEventListener('scroll', check); };
  }, [visible, settled, ready]);
  return <section ref={section} id="birthday-letter" tabIndex={-1} className="exp-section birthday-letter-section" aria-labelledby="birthday-letter-title">
    <div className="wish-letter-reveal" data-reading-group="letter">
      {(ready || settled) && <span className="sr-only" role="status">{CONFIG.cake.status}</span>}
      <TypewriterWish ready={ready || settled} />
    </div>
  </section>;
}

export function WishCake({ blown, onBlow }: { blown: boolean; onBlow: () => void }) {
  const { reduced } = usePresentationMotion();
  useEffect(() => { if (blown && !reduced) return birthdayFireworks(); }, [blown, reduced]);
  return <section id="birthday-cake" className="exp-section wish-cake-section" aria-labelledby="cake-title">
    <div className="exp-section-heading"><h2 id="cake-title">{CONFIG.cake.title}<br /><em>{CONFIG.cake.emphasis}</em></h2><p role="status">{blown ? CONFIG.cake.blown : CONFIG.cake.prompt}</p></div>
    <motion.div className={`birthday-cake-art ${blown ? 'is-blown' : ''}`} initial={reduced ? false : { y: 35 }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
      <div className="cake-plate" /><div className="cake-bottom-tier" /><div className="cake-top-tier" /><div className="cake-icing" />
      <div className="cake-decoration" aria-hidden="true"><Heart /><Heart /><Heart /></div>
      <button type="button" className="candle-button" onClick={onBlow} disabled={blown} aria-label={CONFIG.cake.blowAction} aria-pressed={blown}>
        {String(CONFIG.person.age).split('').map((digit, i) => <NumberCandle key={i} digit={digit} blown={blown} />)}
      </button>
    </motion.div>
  </section>;
}
