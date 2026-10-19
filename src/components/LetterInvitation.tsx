import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkle } from 'lucide-react';

export function LetterInvitation({ onEnter }: { onEnter: () => void }) {
  const [opening, setOpening] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'instant' });
    button.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
    };
  }, []);

  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(onEnter, 1300);
    return () => window.clearTimeout(timer);
  }, [opening, onEnter]);

  return (
    <motion.div
      className={`letter-invitation ${opening ? 'is-opening' : ''}`}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="invitation-date">22 OCTOBER 2026</div>
      <motion.div
        className="invitation-heading"
        animate={{ opacity: opening ? 0 : 1, y: opening ? -15 : 0 }}
        transition={{ duration: 0.35 }}
      >
        <span className="invitation-flower">
          <Sparkle size={25} strokeWidth={1} />
        </span>
        <h1>
          A little something,<br />
          <em>just for you.</em>
        </h1>
        <p>มีจดหมายถึงมิวด้วยล่ะ</p>
      </motion.div>

      <button
        ref={button}
        className="invitation-envelope"
        onClick={() => setOpening(true)}
        disabled={opening}
        aria-label="เปิดจดหมายเพื่อเข้าสู่เรื่องราววันเกิด"
      >
        <span className="envelope-back" />
        <motion.span
          className="invitation-letter"
          animate={opening ? { y: -100, rotate: -3 } : { y: 0, rotate: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="invitation-letter-to">dear mimiw,</span>
          <span className="invitation-letter-age">25</span>
          <span className="invitation-letter-message">a lovely new chapter awaits.</span>
          <Heart size={18} strokeWidth={1.2} />
        </motion.span>
        <span className="envelope-pocket" />
        <motion.span
          className="envelope-flap"
          animate={opening ? { rotateX: 180 } : { rotateX: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="envelope-seal"
          animate={{ opacity: opening ? 0 : 1, scale: opening ? 0.5 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Heart size={21} fill="currentColor" strokeWidth={1} />
        </motion.span>
        <span className="envelope-addressee">for mimiw, with love.</span>
      </button>
      <p className="invitation-instruction" role="status">
        {opening ? 'เรื่องราวเล็ก ๆ กำลังเริ่มต้นขึ้น' : 'แตะที่ซอง เพื่อเปิดเรื่องราวของมิว'}
      </p>
      <span className="invitation-bottom-mark" aria-hidden="true">
        <Heart size={13} strokeWidth={1} />
      </span>
    </motion.div>
  );
}
