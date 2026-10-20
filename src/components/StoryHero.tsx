import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Heart } from 'lucide-react';
import { CONFIG } from '../config';
import { birthdayDate, graphemes, livedTime } from '../lib/birthday';
import { usePresentationMotion } from '../context/MotionPreference';

export function TimeCounter({ active }: { active: boolean }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [active]);
  const values = livedTime(CONFIG.person.birthDate, now);
  return <div className="life-counter">
    <p>{CONFIG.hero.counterTitle}</p>
    <div className="life-counter-values" aria-label={CONFIG.hero.counterTitle}>
      {values.map((value, i) => <div key={i}><span>{i === 0 ? value.toLocaleString(CONFIG.person.locale) : String(value).padStart(2, '0')}</span><small>{CONFIG.hero.counterLabels[i]}</small></div>)}
    </div>
    <p className="counter-note">{CONFIG.hero.counterNote}</p>
  </div>;
}

export function StoryHero({ entered }: { entered: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = usePresentationMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -190]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 85]);
  const letters = useMemo(() => graphemes(CONFIG.person.name), []);
  return <section id="hero" ref={ref} className="exp-hero exp-section">
    <div className="exp-date">{birthdayDate('english')}</div>
    <div className="exp-hero-layout">
      <motion.div className="exp-hero-copy" style={reduced ? undefined : { y: copyY }}>
        <motion.p className="hero-greeting" initial={false} animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 18 }} transition={{ duration: 0.65 }}>{CONFIG.hero.title}</motion.p>
        <motion.h1 aria-label={CONFIG.person.name} initial="hidden" animate={entered ? 'visible' : 'hidden'} variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.08, delayChildren: 0.2 } } }}>
          {letters.map((letter, index) => <motion.span key={index} aria-hidden="true" variants={{ hidden: { opacity: 0, y: reduced ? 0 : 24 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>{letter}</motion.span>)}<span className="name-period" aria-hidden="true">.</span>
        </motion.h1>
        <motion.div initial={false} animate={{ opacity: entered ? 1 : 0 }} transition={{ delay: 0.55, duration: 0.8 }}><p className="exp-hero-dedication">{CONFIG.hero.dedication}</p><span className="exp-handwritten">{CONFIG.hero.note}</span><TimeCounter active={entered} /></motion.div>
      </motion.div>
      <motion.div className="exp-hero-portrait" style={reduced ? undefined : { y: imageY }} initial={false} animate={{ opacity: entered ? 1 : 0 }} transition={{ duration: .35 }}>
        {entered ? <motion.figure layoutId="birthday-photo" style={{ rotate: 6 }} transition={{ layout: { duration: reduced ? 0 : CONFIG.motion.photoTravelMs / 1000, ease: [0.22, 1, 0.36, 1] } }}>
          <span className="paper-tape" aria-hidden="true" /><img src={CONFIG.hero.portrait} alt={CONFIG.hero.portraitAlt} fetchPriority="high" /><figcaption>{CONFIG.hero.photoCaption}<Heart size={15} strokeWidth={1.2} /></figcaption>
        </motion.figure> : <figure className="hero-photo-placeholder" aria-hidden="true"><img src={CONFIG.hero.portrait} alt="" fetchPriority="high" /><figcaption>{CONFIG.hero.photoCaption}</figcaption></figure>}
        <div className="exp-birthday-seal"><small>{CONFIG.hero.sealTop}</small><strong>{CONFIG.person.age}</strong><small>{CONFIG.hero.sealBottom}</small></div>
      </motion.div>
    </div>
    <div className="exp-scroll-hint"><span>{CONFIG.hero.scroll}</span><ArrowDown size={17} /></div>
  </section>;
}
