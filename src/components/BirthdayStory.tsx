import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useScroll, useSpring } from 'framer-motion';
import { Music2, VolumeX } from 'lucide-react';
import { CONFIG } from '../config';
import { useAudio } from '../context/AudioContext';
import { ExperienceGate } from './ExperienceGate';
import { StoryHero } from './StoryHero';
import { RewindBento } from './RewindBento';
import { MemoryLane } from './MemoryLane';
import { SecretWishes } from './SecretWishes';
import { BirthdayLetter, WishCake } from './WishCake';
import { navigateJourney } from '../lib/journey';
import { FloatingParticles } from './FloatingParticles';
import { StoryChapter, StoryJourney } from './StoryJourney';

export function BirthdayStory() {
  const [entered, setEntered] = useState(false);
  const [blown, setBlown] = useState(false);
  const [letterReady, setLetterReady] = useState(false);
  const main = useRef<HTMLElement>(null);
  const { isAmbientPlaying, isSongPlaying, toggleSound, audioError } = useAudio();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const enter = useCallback(() => { window.scrollTo({ top: 0, behavior: 'instant' }); setEntered(true); }, []);
  const playing = isAmbientPlaying || isSongPlaying;

  useEffect(() => {
    if (!blown) return;
    // Let the smoke and first fireworks register, then travel to the final chapter.
    const timer = window.setTimeout(() => navigateJourney('birthday-letter', () => {
      document.getElementById('birthday-letter')?.focus({ preventScroll: true });
      setLetterReady(true);
    }), CONFIG.motion.cakeToLetterMs);
    return () => window.clearTimeout(timer);
  }, [blown]);

  useEffect(() => {
    const root = document.documentElement;
    const aliases: Record<string, string> = { paperDeep: 'paper-deep', accent: 'rose', accentDark: 'rose-dark', envelopeFlap: 'envelope-flap', cakeShade: 'cake-shade', flameCore: 'flame-core' };
    for (const [key, value] of Object.entries(CONFIG.theme)) if (typeof value === 'string') root.style.setProperty(`--${aliases[key] ?? key}`, value);
    document.title = CONFIG.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', CONFIG.meta.description);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', CONFIG.theme.paper);
    const visibility = () => root.classList.toggle('motion-paused', document.hidden);
    visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, []);

  return <LayoutGroup id="birthday-invitation"><div className="birthday-experience">
    <StoryJourney main={main} entered={entered} />
    <FloatingParticles />
    {entered && <><a href="#main" className="skip-link">{CONFIG.labels.skip}</a><motion.div className="reading-progress" style={{ scaleX: progress }} aria-hidden="true" /></>}
    <main ref={main} id="main" tabIndex={-1} inert={!entered} aria-hidden={!entered} className={entered ? 'experience-main' : 'experience-main story-awaiting'}>
      <StoryChapter index={0}><StoryHero entered={entered} /></StoryChapter>
      <StoryChapter index={1} reading><RewindBento /></StoryChapter>
      <MemoryLane />
      <StoryChapter index={5} reading><SecretWishes /></StoryChapter>
      <StoryChapter index={6} reading><WishCake blown={blown} onBlow={() => setBlown(true)} /></StoryChapter>
      {blown && <StoryChapter index={7} reading><BirthdayLetter ready={letterReady} /></StoryChapter>}
    </main>
    <div className="quiet-controls experience-controls">
      <button type="button" onClick={toggleSound} aria-label={playing ? CONFIG.labels.soundOff : CONFIG.labels.soundOn} aria-pressed={playing} title={playing ? CONFIG.labels.soundOff : CONFIG.labels.soundOn}>{playing ? <Music2 size={16} /> : <VolumeX size={16} />}</button>
      {audioError && <span className="audio-error" role="status">{audioError}</span>}
    </div>
    <AnimatePresence onExitComplete={() => main.current?.focus({ preventScroll: true })}>{!entered && <ExperienceGate key="gate" onEnter={enter} />}</AnimatePresence>
  </div></LayoutGroup>;
}
