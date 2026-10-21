import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Sparkle } from 'lucide-react';
import { CONFIG } from '../config';
import { usePresentationMotion } from '../context/MotionPreference';
import { JOURNEY_NAVIGATE, journeyStops, nextJourneyStop, readingStops, type JourneyNavigation } from '../lib/journey';

export function StoryChapter({ index, children, reading = false }: { index: number; children: ReactNode; reading?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = usePresentationMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, .45, .55, 1], [105, 0, 0, -105]);
  const scale = useTransform(scrollYProgress, [0, .45, .55, 1], [.94, 1, 1, .96]);
  return <div ref={ref} className="story-chapter" data-chapter={index} data-reading-chapter={reading || undefined}>
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
    let destination: number | null = null;
    let viewportWidth = window.innerWidth;
    // offsetTop ignores the decorative entrance/parallax transforms.
    const layoutTop = (element: HTMLElement) => {
      let top = 0;
      for (let current: HTMLElement | null = element; current; current = current.offsetParent as HTMLElement | null) top += current.offsetTop;
      return top;
    };
    const measureStops = () => {
      const chapters = [...(main.current?.querySelectorAll<HTMLElement>('[data-chapter]') ?? [])];
      const viewport = window.visualViewport?.height ?? window.innerHeight;
      const viewportTop = window.visualViewport?.offsetTop ?? 0;
      const controls = document.querySelector('.experience-controls')?.getBoundingClientRect();
      const progress = document.querySelector('.journey-progress')?.getBoundingClientRect();
      const topInset = Math.max(24, (controls?.bottom ?? viewportTop + 48) - viewportTop + 16);
      const bottomInset = Math.max(24, viewportTop + viewport - (progress?.top ?? viewportTop + viewport - 48) + 16);
      // Cards are packed per viewport on every size: tablets (iPad portrait and landscape) can have
      // chapters taller than the screen too. Beyond phones, the progress indicator sits in a corner,
      // so a chapter that already fits one screen needs no stop besides its own.
      const phone = window.matchMedia('(max-width: 768px)').matches;
      const landmarks = chapters.flatMap(chapter => {
        const group = chapter.querySelector<HTMLElement>('[data-reading-group]');
        if (!group || (!phone && chapter.offsetHeight <= viewport + 1)) return [];
        const items = [...group.children].filter((item): item is HTMLElement => item instanceof HTMLElement && !item.matches('.sr-only, [hidden], [aria-hidden="true"]'));
        return readingStops(items.map(item => ({ top: layoutTop(item), bottom: layoutTop(item) + item.offsetHeight })), layoutTop(chapter), viewport, topInset, bottomInset);
      });
      return journeyStops(chapters.map(layoutTop), viewport, document.documentElement.scrollHeight, landmarks);
    };
    const stop = () => { cancelAnimationFrame(frame); busy = false; destination = null; latched = false; accumulated = 0; };
    const retarget = () => {
      if (window.innerWidth !== viewportWidth) { viewportWidth = window.innerWidth; stop(); return; }
      if (destination === null) return;
      const previousTarget = destination;
      destination = measureStops().reduce((nearest, position) => Math.abs(position - previousTarget) < Math.abs(nearest - previousTarget) ? position : nearest);
    };
    const animateTo = (target: number, onArrive?: () => void) => {
      cancelAnimationFrame(frame);
      destination = target;
      const from = window.scrollY;
      const began = performance.now();
      busy = true;
      latched = true;
      const tick = (now: number) => {
        const t = Math.min(1, (now - began) / Math.max(200, CONFIG.motion.chapterScrollMs));
        const eased = t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
        window.scrollTo({ top: from + ((destination ?? target) - from) * eased, behavior: 'instant' });
        if (t < 1) frame = requestAnimationFrame(tick);
        else { busy = false; destination = null; onArrive?.(); }
      };
      frame = requestAnimationFrame(tick);
    };
    const go = (direction: number) => {
      const target = nextJourneyStop(measureStops(), window.scrollY, direction);
      if (target !== undefined) animateTo(target);
    };
    const navigate = (event: Event) => {
      const { target, onArrive } = (event as CustomEvent<JourneyNavigation>).detail;
      const section = document.getElementById(target);
      if (!section) return;
      const chapter = section.closest<HTMLElement>('[data-chapter]') ?? section;
      const max = Math.max(0, document.documentElement.scrollHeight - (window.visualViewport?.height ?? innerHeight));
      animateTo(Math.min(max, layoutTop(chapter)), onArrive);
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
    window.addEventListener(JOURNEY_NAVIGATE, navigate);
    window.addEventListener('keydown', key);
    window.addEventListener('pointerdown', stop);
    window.addEventListener('resize', retarget);
    window.visualViewport?.addEventListener('resize', retarget);
    const layoutObserver = new ResizeObserver(() => { if (busy) retarget(); });
    if (main.current) layoutObserver.observe(main.current);
    window.addEventListener('touchstart', touchStart, { passive: true });
    window.addEventListener('touchmove', touchMove, { passive: false });
    window.addEventListener('touchend', touchEnd);
    window.addEventListener('touchcancel', touchCancel);
    return () => {
      stop(); document.documentElement.classList.remove('has-chapter-scroll');
      window.removeEventListener(JOURNEY_NAVIGATE, navigate);
      window.removeEventListener('wheel', wheel); window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', stop); window.removeEventListener('resize', retarget);
      window.visualViewport?.removeEventListener('resize', retarget);
      layoutObserver.disconnect();
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
  const color = useTransform(scrollY, starts, CONFIG.journey.chapters.slice(0, starts.length).map(item => item.color));
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
