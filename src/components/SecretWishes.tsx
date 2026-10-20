import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Sparkle } from 'lucide-react';
import { CONFIG } from '../config';
import { usePresentationMotion } from '../context/MotionPreference';
import { WishButterflies } from './WishButterflies';

function Secret({ card, index, flipped, onToggle }: { card: typeof CONFIG.secrets.cards[number]; index: number; flipped: boolean; onToggle: () => void }) {
  const { reduced } = usePresentationMotion();
  return <motion.div className="secret-card-slot" initial={reduced ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, delay: reduced ? 0 : index * 0.1 }}>
    <button type="button" className={`secret-card ${flipped ? 'is-flipped' : ''}`} aria-expanded={flipped} aria-controls={`secret-${index}`} onClick={onToggle} aria-label={`${card.title} — ${flipped ? CONFIG.secrets.close : CONFIG.secrets.reveal}`}>
      <span className="secret-card-inner">
        <span className="secret-face secret-front" aria-hidden={flipped}><span className="secret-number">{String(index + 1).padStart(2, '0')}</span><Heart size={39} strokeWidth={1} /><strong>{card.title}</strong><small>{CONFIG.secrets.reveal}<Sparkle size={12} /></small></span>
        <span className="secret-face secret-back" id={`secret-${index}`} aria-hidden={!flipped}><Heart size={20} strokeWidth={1.2} /><strong>{card.title}</strong><span>{card.message}</span><small>{CONFIG.secrets.close}</small></span>
      </span>
    </button>
  </motion.div>;
}

export function SecretWishes() {
  const [flipped, setFlipped] = useState(() => CONFIG.secrets.cards.map(() => false));
  const [celebrating, setCelebrating] = useState(false);
  const celebrated = useRef(false);
  const section = useRef<HTMLElement>(null);
  const visible = useInView(section, { amount: .05 });
  const finish = useCallback(() => setCelebrating(false), []);
  useEffect(() => {
    const image = new Image();
    image.src = CONFIG.secrets.butterflyImage;
  }, []);
  useEffect(() => { if (!visible) finish(); }, [visible, finish]);
  const toggle = (index: number) => {
    const next = flipped.map((value, i) => i === index ? !value : value);
    setFlipped(next);
    if (next.every(Boolean) && !celebrated.current) {
      celebrated.current = true;
      setCelebrating(true);
    }
  };
  return <section ref={section} id="wishes" className="exp-section secret-section" aria-labelledby="secret-title"><div className="exp-section-heading"><h2 id="secret-title">{CONFIG.secrets.title}<br /><em>{CONFIG.secrets.emphasis}</em></h2><p>{CONFIG.secrets.description}</p></div><div className="secret-grid" data-reading-group="wishes">{CONFIG.secrets.cards.map((card, index) => <Secret key={index} card={card} index={index} flipped={flipped[index]} onToggle={() => toggle(index)} />)}</div>
    {celebrating && <><span className="sr-only" role="status">{CONFIG.secrets.completeStatus}</span><WishButterflies onComplete={finish} /></>}
  </section>;
}
