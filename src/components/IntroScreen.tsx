import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
  canStart: boolean;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete, canStart }) => {
  const [dayFlipped, setDayFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!canStart) return;

    // Start flip animation after 1.2s
    const flipTimer = setTimeout(() => {
      setDayFlipped(true);
    }, 1200);

    // Auto transition to main content after flip completes
    const transitionTimer = setTimeout(() => {
      triggerExit();
    }, 3200);

    return () => {
      clearTimeout(flipTimer);
      clearTimeout(transitionTimer);
    };
  }, [canStart]);

  const triggerExit = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      onComplete();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-obsidian-900 text-white overflow-hidden select-none">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blush-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Circle expansion transition layer */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 35, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1] }}
            className="absolute z-50 w-24 h-24 rounded-full bg-cream-100 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center px-4 max-w-lg text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-blush-200 text-xs tracking-wider uppercase font-medium">
          <Sparkles className="w-3.5 h-3.5 text-blush-500 animate-spin-slow" />
          <span>Special Birthday Moment</span>
        </div>

        <h1 className="font-mali text-2xl sm:text-3xl font-bold mb-8 text-white/90">
          วันพิเศษกำลังจะเริ่มต้นขึ้น...
        </h1>

        {/* Flip Clock Container */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 py-6 px-4 sm:px-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-2xl">
          {/* Day Group */}
          <div className="flex gap-1.5 sm:gap-2">
            <div className="w-10 h-14 sm:w-14 sm:h-20 flex items-center justify-center rounded-xl sm:rounded-2xl bg-neutral-900 border border-white/15 text-2xl sm:text-4xl font-bold font-krungthep shadow-inner text-white">
              2
            </div>
            {/* Flipping Day digit */}
            <div className="relative w-10 h-14 sm:w-14 sm:h-20 flip-container">
              <AnimatePresence mode="wait">
                {!dayFlipped ? (
                  <motion.div
                    key="day-1"
                    exit={{ rotateX: -90, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex items-center justify-center rounded-xl sm:rounded-2xl bg-neutral-900 border border-white/15 text-2xl sm:text-4xl font-bold font-krungthep text-white shadow-lg"
                  >
                    1
                  </motion.div>
                ) : (
                  <motion.div
                    key="day-2"
                    initial={{ rotateX: 90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                    className="absolute inset-0 flex items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-b from-blush-500 to-blush-600 border border-blush-400 text-2xl sm:text-4xl font-bold font-krungthep text-white shadow-lg shadow-blush-500/40"
                  >
                    2
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <span className="text-xl sm:text-3xl text-white/40 font-bold">:</span>

          {/* Month Group */}
          <div className="flex gap-1.5 sm:gap-2">
            <div className="w-10 h-14 sm:w-14 sm:h-20 flex items-center justify-center rounded-xl sm:rounded-2xl bg-neutral-900 border border-white/15 text-2xl sm:text-4xl font-bold font-krungthep text-white">
              1
            </div>
            <div className="w-10 h-14 sm:w-14 sm:h-20 flex items-center justify-center rounded-xl sm:rounded-2xl bg-neutral-900 border border-white/15 text-2xl sm:text-4xl font-bold font-krungthep text-white">
              0
            </div>
          </div>

          <span className="text-xl sm:text-3xl text-white/40 font-bold">:</span>

          {/* Year Group */}
          <div className="flex gap-1 sm:gap-1.5">
            {['2', '5', '6', '9'].map((digit, i) => (
              <div
                key={i}
                className="w-8 h-14 sm:w-12 sm:h-20 flex items-center justify-center rounded-xl sm:rounded-2xl bg-neutral-900 border border-white/15 text-xl sm:text-3xl font-bold font-krungthep text-white/90"
              >
                {digit}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-white/50 font-sarabun">
          22 ตุลาคม 2569 • วันเกิดคนสำคัญ
        </p>

        {/* Start button or auto-progress indication */}
        <motion.button
          onClick={triggerExit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 flex items-center gap-2 py-3 px-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all cursor-pointer"
        >
          <span>เปิดของขวัญทันที</span>
          <ArrowRight className="w-4 h-4 text-blush-400" />
        </motion.button>
      </motion.div>
    </div>
  );
};
