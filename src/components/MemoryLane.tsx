import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart } from 'lucide-react';
import { CONFIG } from '../config';
import { usePresentationMotion } from '../context/MotionPreference';
import { StoryChapter } from './StoryJourney';

function Memory({ photo, index }: { photo: typeof CONFIG.memories.photos[number]; index: number }) {
  const [selected, setSelected] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { reduced } = usePresentationMotion();
  const direction = index % 2 === 0 ? -1 : 1;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, .5, 1], [direction * 95, 0, direction * -95]);
  return <motion.figure ref={ref} className={`lane-photo ${selected ? 'is-selected' : ''}`} style={reduced ? undefined : { y }} initial={reduced ? false : { opacity: 0, x: direction * 65 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
    <motion.button type="button" className="lane-polaroid" aria-label={`${photo.caption} — ${CONFIG.memories.touchHint}`} aria-pressed={selected} onClick={() => setSelected(value => !value)} animate={{ rotate: reduced || selected ? 0 : direction * 3, scale: selected && !reduced ? 1.035 : 1 }} whileHover={reduced ? undefined : { rotate: 0, scale: 1.035 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      <span className="paper-tape" aria-hidden="true" /><img src={photo.src} alt={photo.caption} loading="lazy" draggable={false} />
      <span className="lane-caption"><span>{photo.caption}</span><Heart size={16} strokeWidth={1.2} /></span>
    </motion.button>
    <figcaption>{photo.note}</figcaption>
  </motion.figure>;
}

export function MemoryLane() {
  return <>{[0, 1, 2].map(pair => <StoryChapter key={pair} index={pair + 2}><section id={pair === 0 ? 'moments' : `moments-${pair + 1}`} className="exp-section memory-lane memory-scene" aria-labelledby={`memory-title-${pair}`}>
    <div className="exp-section-heading memory-scene-heading">{pair === 0 ? <h2 id={`memory-title-${pair}`}>{CONFIG.memories.title}<br /><em>{CONFIG.memories.emphasis}</em></h2> : <h2 id={`memory-title-${pair}`} className="memory-thai-title">{CONFIG.journey.chapters[pair + 2].label}</h2>}{pair === 0 && <p>{CONFIG.memories.description}</p>}</div>
    <div className="memory-lane-grid">{CONFIG.memories.photos.slice(pair * 2, pair * 2 + 2).map((photo, index) => <Memory key={photo.src} photo={photo} index={pair * 2 + index} />)}</div>
  </section></StoryChapter>)}</>;
}
