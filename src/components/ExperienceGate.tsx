import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkle } from 'lucide-react';
import { CONFIG } from '../config';
import { birthdayDate } from '../lib/birthday';
import { welcomeConfetti } from '../lib/celebrate';
import { useAudio } from '../context/AudioContext';
import { usePresentationMotion } from '../context/MotionPreference';

export function ExperienceGate({ onEnter }: { onEnter: () => void }) {
  const [opening, setOpening] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const { reduced } = usePresentationMotion();
  const { setAudioAllowed } = useAudio();
  useEffect(() => {
    const body = document.body.style.overflow;
    const html = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'instant' });
    button.current?.focus({ preventScroll: true });
    return () => { document.body.style.overflow = body; document.documentElement.style.overflow = html; };
  }, []);
  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(onEnter, reduced ? 150 : CONFIG.motion.gateOpenMs);
    return () => window.clearTimeout(timer);
  }, [opening, onEnter, reduced]);
  const open = () => { if (opening) return; setAudioAllowed(true); if (!reduced) welcomeConfetti(); setOpening(true); };
  return <motion.div className={`letter-invitation experience-gate ${opening ? 'is-opening' : ''}`} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0.2 : CONFIG.motion.photoTravelMs / 1000 }}>
    <div className="invitation-date">{birthdayDate('english')}</div>
    <motion.div className="invitation-heading" animate={{ opacity: opening ? 0 : 1, y: opening ? -15 : 0 }} transition={{ duration: 0.35 }}><span className="invitation-flower"><Sparkle size={25} strokeWidth={1} /></span><h1>{CONFIG.gate.title}<br /><em>{CONFIG.gate.emphasis}</em></h1><p>{CONFIG.gate.description}</p></motion.div>
    <motion.div animate={!opening && !reduced ? { y: [-5, 5, -5] } : { y: 0 }} transition={{ duration: 4.5, repeat: opening || reduced ? 0 : Infinity, ease: 'easeInOut' }}>
      <button type="button" ref={button} className="invitation-envelope" onClick={open} disabled={opening} aria-label={CONFIG.gate.action}>
        <span className="envelope-back" />
        <span className="invitation-letter" aria-hidden="true"><span className="invitation-letter-to">{CONFIG.gate.salutation}</span><span className="invitation-letter-age">{CONFIG.person.age}</span><span className="invitation-letter-message">{CONFIG.gate.letterMessage}</span></span>
        <motion.div className="invitation-photo-reveal" aria-hidden="true" initial={false} animate={opening ? { y: reduced ? 0 : -155, opacity: 1 } : { y: 0, opacity: 0 }} transition={{ delay: reduced ? 0 : .4, duration: reduced ? .2 : CONFIG.motion.photoLiftMs / 1000, ease: [0.22, 1, 0.36, 1] }}>
          <motion.figure layoutId="birthday-photo" className="gate-photo-card" style={{ rotate: -2 }} transition={{ layout: { duration: CONFIG.motion.photoTravelMs / 1000, ease: [0.22, 1, 0.36, 1] } }}>
            <img src={CONFIG.hero.portrait} alt="" fetchPriority="high" /><figcaption>{CONFIG.hero.photoCaption}<Heart size={12} strokeWidth={1.2} /></figcaption>
          </motion.figure>
        </motion.div>
        <span className="envelope-pocket" /><motion.span className="envelope-flap" animate={opening ? { rotateX: 180 } : { rotateX: 0 }} transition={{ duration: reduced ? 0 : 0.6 }} /><motion.span className="envelope-seal" animate={{ opacity: opening ? 0 : 1, scale: opening ? 0.5 : 1 }} transition={{ duration: 0.2 }}><Heart size={21} fill="currentColor" strokeWidth={1} /></motion.span><span className="envelope-addressee">{CONFIG.gate.sealNote}</span>
      </button>
    </motion.div>
    <p className="invitation-instruction" role="status">{opening ? CONFIG.gate.opening : CONFIG.gate.hint}</p><span className="invitation-bottom-mark" aria-hidden="true"><Heart size={13} /></span>
  </motion.div>;
}
