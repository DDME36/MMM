import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const FloatingMusicPill: React.FC = () => {
  const { isAmbientPlaying, toggleAmbient, audioAllowed } = useAudio();

  // If user hasn't made a choice yet, hide
  if (audioAllowed === null) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleAmbient}
      className={`fixed bottom-6 right-6 z-30 flex items-center gap-2.5 py-2.5 px-4 rounded-full shadow-lg backdrop-blur-xl border transition-all duration-300 ${
        isAmbientPlaying
          ? 'bg-white/90 border-blush-200 text-blush-600 shadow-blush-500/20'
          : 'bg-white/80 border-gray-200 text-gray-500 hover:text-gray-700'
      }`}
      aria-label="Toggle ambient music"
    >
      {isAmbientPlaying ? (
        <>
          <Volume2 className="w-4 h-4 text-blush-500" />
          {/* Animated sound wave bars */}
          <div className="flex items-center gap-0.5 h-3">
            {[0.4, 0.8, 0.5, 1, 0.6].map((height, i) => (
              <motion.span
                key={i}
                animate={{ scaleY: [0.3, height, 0.3] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + i * 0.15,
                  ease: 'easeInOut',
                }}
                className="w-0.5 h-full bg-blush-500 rounded-full origin-bottom"
              />
            ))}
          </div>
          <span className="text-xs font-medium font-sarabun pr-0.5">เสียงเปิดอยู่</span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4" />
          <span className="text-xs font-medium font-sarabun pr-0.5">เสียงปิดอยู่</span>
        </>
      )}
    </motion.button>
  );
};
