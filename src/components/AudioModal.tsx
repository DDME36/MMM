import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

interface AudioModalProps {
  onConfirm: () => void;
}

export const AudioModal: React.FC<AudioModalProps> = ({ onConfirm }) => {
  const { audioAllowed, setAudioAllowed } = useAudio();

  if (audioAllowed !== null) return null;

  const handleChoice = (enable: boolean) => {
    setAudioAllowed(enable);
    onConfirm();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-sm p-6 overflow-hidden text-center bg-white/95 rounded-3xl shadow-2xl border border-white/80"
        >
          {/* Decorative background glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blush-200/50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-peach/20 rounded-full blur-2xl pointer-events-none" />

          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-tr from-blush-500 to-blush-600 text-white shadow-lg shadow-blush-500/30"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>

          <h3 className="font-mali text-2xl font-bold text-gray-900 mb-2">
            ยินดีต้อนรับนะ 🎉
          </h3>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed font-sarabun">
            เว็บไซต์นี้มีเสียงดนตรีบรรเลงเพื่อเพิ่มบรรยากาศความทรงจำ<br />
            คุณต้องการเปิดเสียงเพื่อรับชมหรือไม่?
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleChoice(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-blush-500 to-blush-600 text-white font-medium text-sm shadow-md shadow-blush-500/25 hover:shadow-lg hover:brightness-105 active:scale-95 transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>เปิดเสียง</span>
            </button>
            <button
              onClick={() => handleChoice(false)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium text-sm active:scale-95 transition-all"
            >
              <VolumeX className="w-4 h-4" />
              <span>ไม่เปิด</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
