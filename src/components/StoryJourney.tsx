import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Sparkle } from 'lucide-react';
import { CONFIG } from '../config';
import { usePresentationMotion } from '../context/MotionPreference';
import { journeyStops, nextJourneyStop } from '../lib/journey';

export function StoryChapter({ index, children }: { index: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = usePresentationMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, .45, .55, 1], [105, 0, 0, -105]);
  const scale = useTransform(scrollYProgress, [0, .45, .55, 1], [.94, 1, 1, .96]);
  return <div ref={ref} className="story-chapter" data-chapter={index}>
    <motion.div className="chapter-content" style={reduced ? undefined : { y, scale }}>{children}</motion.div>
  </div>;
}

function useChapterScroll(main: RefObject<HTMLElement | null>, enabled: boolean, reduced: boolean) {
  useEffect(() => {
    if (!enabled || reduced) return;
    document.documentElement.classList.add('has-chapter-scroll');
    let frame = 0;
    let busy = false;
    let latched = false;
    let lastWheel = 0;
    let accumulated = 0;
    let previousDirection = 0;
    let touch: { x: number; y: number } | null = null;
    const stop = () => { cancelAnimationFrame(frame); busy = false; latched = false; accumulated = 0; };
    const go = (direction: number) => {
      const chapters = [...(main.current?.querySelectorAll<HTMLElement>('[data-chapter]') ?? [])];
      const stops = journeyStops(chapters.map(chapter => chapter.getBoundingClientRect().top + window.scrollY), window.innerHeight, document.documentElement.scrollHeight);
      const target = nextJourneyStop(stops, window.scrollY, direction);
      if (target === undefined) return;
      const from = window.scrollY;
      const began = performance.now();
      busy = true;
      latched = true;
      const tick = (now: number) => {
        const t = Math.min(1, (now - began) / Math.max(200, CONFIG.motion.chapterScrollMs));
        const eased = t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
        window.scrollTo({ top: from + (target - from) * eased, behavior: 'instant' });
        if (t < 1) frame = requestAnimationFrame(tick);
        else busy = false;
      };
      frame = requestAnimationFrame(tick);
    };
    const isControl = (target: EventTarget | null) => target instanceof Element && !!target.closest('input, textarea, select, [contenteditable="true"], [data-native-scroll]');
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || isControl(event.target) || !event.deltaY) return;
      event.preventDefault();
      const now = performance.now();
      const quiet = now - lastWheel > 180;
      lastWheel = now;
      if (busy || (latched && !quiet)) return;
      if (quiet) { latched = false; accumulated = 0; }
      const direction = Math.sign(event.deltaY);
      if (direction !== previousDirection) accumulated = 0;
      previousDirection = direction;
      accumulated += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (Math.abs(accumulated) >= CONFIG.motion.wheelThreshold) { accumulated = 0; go(direction); }
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { stop(); return; }
      if (isControl(event.target) || event.target instanceof Element && event.target.closest('button, a')) return;
      if (['PageDown', 'PageUp', ' '].includes(event.key)) {
        event.preventDefault();
        if (!busy) go(event.key === 'PageUp' || event.shiftKey ? -1 : 1);
      } else if (['Home', 'End', 'ArrowDown', 'ArrowUp'].includes(event.key)) stop();
    };
    const touchStart = (event: TouchEvent) => {
      touch = event.touches.length === 1 && !isControl(event.target) ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    };
    const touchMove = (event: TouchEvent) => {
      if (!touch || event.touches.length !== 1) return;
      const dx = event.touches[0].clientX - touch.x;
      const dy = event.touches[0].clientY - touch.y;
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx) && event.cancelable) event.preventDefault();
    };
    const touchEnd = (event: TouchEvent) => {
      if (!touch || !event.changedTouches.length) return;
      const dy = touch.y - event.changedTouches[0].clientY;
      const dx = touch.x - event.changedTouches[0].clientX;
      touch = null;
      if (Math.abs(dy) >= CONFIG.motion.swipeThreshold && Math.abs(dy) > Math.abs(dx) && !busy) go(Math.sign(dy));
    };
    const touchCancel = () => { touch = null; };
    window.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('keydown', key);
    window.addEventListener('pointerdown', stop);
    window.addEventListener('resize', stop);
    window.addEventListener('touchstart', touchStart, { passive: true });
    window.addEventListener('touchmove', touchMove, { passive: false });
    window.addEventListener('touchend', touchEnd);
    window.addEventListener('touchcancel', touchCancel);
    return () => {
      stop(); document.documentElement.classList.remove('has-chapter-scroll');
      window.removeEventListener('wheel', wheel); window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', stop); window.removeEventListener('resize', stop);
      window.removeEventListener('touchstart', touchStart); window.removeEventListener('touchmove', touchMove); window.removeEventListener('touchend', touchEnd); window.removeEventListener('touchcancel', touchCancel);
    };
  }, [enabled, main, reduced]);
}

export function StoryJourney({ main, entered }: { main: RefObject<HTMLElement | null>; entered: boolean }) {
  const { reduced } = usePresentationMotion();
  const [starts, setStarts] = useState(CONFIG.journey.chapters.map((_, i) => i * 900));
  const [chapter, setChapter] = useState(0);
  const { scrollY, scrollYProgress } = useScroll();
  useChapterScroll(main, entered, reduced);
  useEffect(() => {
    if (!main.current) return;
    const measure = () => setStarts([...main.current!.querySelectorAll<HTMLElement>('[data-chapter]')].map(element => element.getBoundingClientRect().top + window.scrollY));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(main.current);
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, [main]);
  useMotionValueEvent(scrollY, 'change', y => {
    const index = starts.reduce((found, start, index) => start <= y + innerHeight * .4 ? index : found, 0);
    setChapter(Math.max(0, Math.min(CONFIG.journey.chapters.length - 1, index)));
  });
  const color = useTransform(scrollY, starts, CONFIG.journey.chapters.map(item => item.color));
  const drift = useTransform(scrollYProgress, [0, 1], ['15vh', '-65vh']);
  const starY = useTransform(scrollYProgress, [0, 1], ['10vh', '82vh']);
  const starRotate = useTransform(scrollYProgress, [0, 1], [-30, 150]);
  return <>
    <motion.div className="journey-atmosphere" aria-hidden="true" style={{ backgroundColor: color }}>
      <motion.div className="journey-orbit" style={reduced ? undefined : { y: drift }} />
      <svg className="journey-thread" viewBox="0 0 460 1000" preserveAspectRatio="none"><path d="M340 -30 C-160 130 600 320 280 480 S-90 760 370 1030" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 9" opacity=".3" /><motion.path d="M340 -30 C-160 130 600 320 280 480 S-90 760 370 1030" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ pathLength: scrollYProgress }} /></svg>
      <motion.span className="journey-star" style={reduced ? undefined : { y: starY, rotate: starRotate }}><Sparkle size={43} strokeWidth={.7} /></motion.span>
    </motion.div>
    {entered && <div className="journey-progress" aria-label={`${chapter + 1} / ${CONFIG.journey.chapters.length} — ${CONFIG.journey.chapters[chapter].label}`}>
      <div className="journey-chapter-name"><span>{String(chapter + 1).padStart(2, '0')} <i>/ {String(CONFIG.journey.chapters.length).padStart(2, '0')}</i></span><span key={chapter}>{CONFIG.journey.chapters[chapter].label}</span></div>
      <div className="journey-segments" aria-hidden="true">{CONFIG.journey.chapters.map((item, index) => <span key={item.label} className={index <= chapter ? 'is-reached' : ''} />)}</div>
      <small>{CONFIG.journey.hint}<ArrowDown size={10} /></small>
    </div>}
  </>;
}
