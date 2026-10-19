import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { BentoMusicPlayer } from './BentoMusicPlayer';
import './RewindBento.css';
import { CONFIG } from '../config';
import { usePresentationMotion } from '../context/MotionPreference';

interface RewindBentoProps {
  isActive?: boolean;
  onScrollNext?: () => void;
}

export const RewindBento: React.FC<RewindBentoProps> = ({ isActive, onScrollNext }) => {
  const { reduced } = usePresentationMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.05 });
  const isInView = isActive !== undefined ? isActive : inView;

  // Animate the birthday age when this chapter enters the viewport.
  const [age, setAge] = useState(0);

  useEffect(() => {
    if (reduced) { setAge(CONFIG.person.age); return; }
    if (!isInView) {
      setAge(0);
      return;
    }

    let current = 0;
    const target = CONFIG.person.age;
    let delay = 25;
    let timer: ReturnType<typeof setTimeout>;

    const runCounter = () => {
      if (current < target) {
        current++;
        setAge(current);
        if (current > 15) delay += 12;
        timer = setTimeout(runCounter, delay);
      }
    };

    timer = setTimeout(runCounter, 40);
    return () => clearTimeout(timer);
  }, [isInView, reduced]);

  // Chat animation state
  const [bubbles, setBubbles] = useState([
    { id: 1, text: '', visible: false, scale: 0.8 },
    { id: 2, text: '', visible: false, scale: 0.8 },
    { id: 3, text: '', visible: false, scale: 0.8 },
    { id: 4, text: '', visible: false, scale: 0.8 },
  ]);

  useEffect(() => {
    if (reduced) { setBubbles(CONFIG.bento.messages.map((item, i) => ({ id: i + 1, text: item.full, visible: true, scale: 1 }))); return; }
    if (!isInView) {
      setBubbles((b) => b.map((item) => ({ ...item, text: '', visible: false })));
      return;
    }

    const nestedTimers: ReturnType<typeof setTimeout>[] = [];
    const later = (callback: () => void) => nestedTimers.push(setTimeout(callback, 800));
    const t1 = setTimeout(() => {
      setBubbles((b) => [
        { ...b[0], text: CONFIG.bento.messages[0].short, visible: true, scale: 0.8 },
        b[1], b[2], b[3]
      ]);
      later(() => {
        setBubbles((b) => [
          { ...b[0], text: CONFIG.bento.messages[0].full, visible: true, scale: 1 },
          b[1], b[2], b[3]
        ]);
      });
    }, 1000);

    const t2 = setTimeout(() => {
      setBubbles((b) => [
        b[0],
        { ...b[1], text: CONFIG.bento.messages[1].short, visible: true, scale: 0.8 },
        b[2], b[3]
      ]);
      later(() => {
        setBubbles((b) => [
          b[0],
          { ...b[1], text: CONFIG.bento.messages[1].full, visible: true, scale: 1 },
          b[2], b[3]
        ]);
      });
    }, 3000);

    const t3 = setTimeout(() => {
      setBubbles((b) => [
        b[0], b[1],
        { ...b[2], text: CONFIG.bento.messages[2].short, visible: true, scale: 0.8 },
        b[3]
      ]);
      later(() => {
        setBubbles((b) => [
          b[0], b[1],
          { ...b[2], text: CONFIG.bento.messages[2].full, visible: true, scale: 1 },
          b[3]
        ]);
      });
    }, 5000);

    const t4 = setTimeout(() => {
      setBubbles((b) => [
        b[0], b[1], b[2],
        { ...b[3], text: CONFIG.bento.messages[3].short, visible: true, scale: 0.8 }
      ]);
      later(() => {
        setBubbles((b) => [
          b[0], b[1], b[2],
          { ...b[3], text: CONFIG.bento.messages[3].full, visible: true, scale: 1 }
        ]);
      });
    }, 7000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      nestedTimers.forEach(clearTimeout);
    };
  }, [isInView, reduced]);

  return (
    <section className="rewind-bento-section" id="rewind" ref={sectionRef}>
      <div className="bento-heading"><h2>{CONFIG.bento.title}<br />{CONFIG.bento.titleSecond} <em>{CONFIG.bento.titleEmphasis}</em></h2><p>{CONFIG.bento.description}</p></div>
      <div className={`rewind-bento-grid ${isInView ? 'bento-reveal' : ''}`}>
        {/* Item 0: Aquarium Photo */}
        <div className="rewind-bento-item rewind-item-0 has-photo">
          <img src={CONFIG.bento.aquarium} alt={CONFIG.bento.aquariumAlt} />
        </div>

        {/* Original bento portrait, floating beyond its card. */}
        <div className="rewind-bento-item rewind-item-1 has-photo">
          <img src={CONFIG.bento.portrait} alt={CONFIG.bento.portraitAlt} />
        </div>

        {/* Item 2: Chat Bubbles */}
        <div className="rewind-bento-item rewind-item-2">
          <div className="w-full h-full flex flex-col gap-3 justify-center items-center p-2">
            {bubbles.map((b) => (
              <div
                key={b.id}
                className="chat-bubble"
                style={{
                  background: CONFIG.theme.accent,
                  color: 'white',
                  padding: '12px 18px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: 500,
                  opacity: b.visible ? 1 : 0,
                  transform: `scale(${b.scale})`,
                  WebkitTransform: `scale(${b.scale})`,
                  transition: 'all 0.3s ease',
                  maxWidth: '85%',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* Preserve the original SVG gradient and six-second name-switching rhythm. */}
        <div className="rewind-bento-item rewind-item-3">
          <div className="name-slider-wrapper">
            <svg className="name-switcher-svg" viewBox="0 0 200 60" role="img" aria-label={CONFIG.bento.nameWords.join(" ")}>
              <defs><linearGradient id="birthdayNameGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={CONFIG.bento.nameGradient[0]} /><stop offset="50%" stopColor={CONFIG.bento.nameGradient[1]} /><stop offset="100%" stopColor={CONFIG.bento.nameGradient[2]} /></linearGradient></defs>
              <g className="original-name-track" aria-hidden="true">
                {CONFIG.bento.nameWords.map((name, i) => <text key={i} x="100" y={30 + i * 60} textAnchor="middle" dominantBaseline="middle" fontFamily="FCKrungThep-Black, Mali, sans-serif" fontSize="48" fontWeight="900" fill="url(#birthdayNameGradient)">{name}</text>)}
              </g>
            </svg>
          </div>
        </div>

        {/* Item 4: Age Counter */}
        <div className="rewind-bento-item rewind-item-4">
          <div
            className="number-counter"
            id="ageCounter"
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: CONFIG.theme.accent,
              fontFamily: "'FCKrungThep-Black', 'Mali', sans-serif",
            }}
          >
            {age}
          </div>
          <div
            style={{
              fontSize: '1.2rem',
              marginTop: '5px',
              color: CONFIG.theme.muted,
              fontFamily: "'FCKrungThep-Black', 'Mali', sans-serif",
            }}
          >
            {CONFIG.bento.ageUnit}
          </div>
        </div>

        {/* Item 5: Apple Music Card */}
        <div className="rewind-bento-item rewind-item-5">
          <BentoMusicPlayer />
        </div>

        {/* Item 6: LOVE Loader (iOS Safe Defs & Spin) */}
        <div className="rewind-bento-item rewind-item-6">
          <div className="love-loader">
            <svg
              viewBox="0 0 64 64"
              style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0.01, pointerEvents: 'none' }}
            >
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="b">
                  <stop stopColor={CONFIG.bento.loveGradients[0][0]} />
                  <stop stopColor={CONFIG.bento.loveGradients[0][1]} offset="1" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2="0" x2="0" y1="64" x1="0" id="c">
                  <stop stopColor={CONFIG.bento.loveGradients[1][0]} />
                  <stop stopColor={CONFIG.bento.loveGradients[1][1]} offset="1" />
                  <animateTransform
                    repeatCount="indefinite"
                    keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                    keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                    dur="8s"
                    values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                    type="rotate"
                    attributeName="gradientTransform"
                  />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="d">
                  <stop stopColor={CONFIG.bento.loveGradients[2][0]} />
                  <stop stopColor={CONFIG.bento.loveGradients[2][1]} offset="1" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="e">
                  <stop stopColor={CONFIG.bento.loveGradients[3][0]} />
                  <stop stopColor={CONFIG.bento.loveGradients[3][1]} offset="1" />
                </linearGradient>
              </defs>
            </svg>
            {/* L */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="42" width="42">
              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#b)" d="M 10,4 V 56 H 54" className="dash" pathLength="360" />
            </svg>
            {/* O */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="42" width="42">
              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="10" stroke="url(#c)" d="M 32 32m 0 -27a 27 27 0 1 1 0 54a 27 27 0 1 1 0 -54" className="spin" pathLength="360" />
            </svg>
            {/* V */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="42" width="42">
              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#d)" d="M 10,4 L 32,56 L 54,4" className="dash" pathLength="360" />
            </svg>
            {/* E */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="42" width="42">
              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#e)" d="M 54,4 H 10 V 28 H 50 M 10,28 V 56 H 54" className="dash" pathLength="360" />
            </svg>
          </div>
        </div>

        {/* Item 7: Geometric Triangle Loader (100% Native SVG Mask on iOS) */}
        <div className="rewind-bento-item rewind-item-7">
          <div className="loader">
            <svg viewBox="0 0 100 100" className="loader-svg">
              <defs>
                <linearGradient id="triangleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="30%" stopColor={CONFIG.bento.triangleGradient[0]} />
                  <stop offset="70%" stopColor={CONFIG.bento.triangleGradient[1]} />
                </linearGradient>
                <mask id="clipping">
                  <polygon points="0,0 100,0 100,100 0,100" fill="black" />
                  <polygon points="25,25 75,25 50,75" fill="white" />
                  <polygon points="50,25 75,75 25,75" fill="white" />
                  <polygon points="35,35 65,35 50,65" fill="white" />
                  <polygon points="35,35 65,35 50,65" fill="white" />
                  <polygon points="35,35 65,35 50,65" fill="white" />
                  <polygon points="35,35 65,35 50,65" fill="white" />
                </mask>
              </defs>
              <rect width="100" height="100" fill="url(#triangleGrad)" mask="url(#clipping)" />
            </svg>
          </div>
        </div>

        {/* A personal note in place of the original unlinked social buttons. */}
        <div className="rewind-bento-item rewind-item-8">
          <div className="bento-note"><strong>{CONFIG.person.age} {CONFIG.bento.note}</strong></div>
          <div className="bento-note">{CONFIG.bento.wish}</div>
        </div>
      </div>
      <button
        type="button"
        className="story-scroll-cue-btn"
        style={{ marginTop: '14px' }}
        onClick={() => {
          if (onScrollNext) onScrollNext();
          else document.getElementById('moments')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span>{CONFIG.bento.scroll}</span>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </button>
    </section>
  );
};
