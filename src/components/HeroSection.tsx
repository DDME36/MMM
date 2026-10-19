import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Heart, Sparkles, Cake } from 'lucide-react';

interface HeroSectionProps {
  onStartClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartClick }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 py-12 text-center overflow-hidden bg-gradient-to-b from-cream-100 via-blush-50/50 to-cream-100"
    >
      {/* Subtle organic gradient blobs */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-blush-200/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-peach/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="absolute top-16 left-[10%] text-2xl sm:text-3xl opacity-70 pointer-events-none select-none"
      >
        🌸
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
        className="absolute top-24 right-[12%] text-2xl sm:text-3xl opacity-70 pointer-events-none select-none"
      >
        ✨
      </motion.div>
      <motion.div
        animate={{ y: [-8, 8, -8], rotate: [-8, 8, -8] }}
        transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-28 left-[15%] text-2xl sm:text-3xl opacity-70 pointer-events-none select-none"
      >
        💖
      </motion.div>
      <motion.div
        animate={{ y: [8, -8, 8], rotate: [8, -8, 8] }}
        transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-32 right-[18%] text-2xl sm:text-3xl opacity-70 pointer-events-none select-none"
      >
        🌺
      </motion.div>

      {/* Central Hero Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-xl mx-auto flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/80 border border-blush-200/60 shadow-sm backdrop-blur-md"
        >
          <Cake className="w-4 h-4 text-blush-600" />
          <span className="font-sarabun text-xs sm:text-sm font-semibold text-blush-700">
            Happy Birthday Mimiw
          </span>
          <Sparkles className="w-3.5 h-3.5 text-blush-500" />
        </motion.div>

        <h1 className="font-mali text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 text-gray-900 leading-tight">
          Happy Birthday <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blush-500 via-peach to-blush-600 bg-clip-text text-transparent">
            มิมิว
          </span>
        </h1>

        <p className="font-sarabun text-base sm:text-xl text-gray-600 max-w-md mx-auto mb-10 leading-relaxed font-normal">
          ขอให้วันนี้อบอุ่น นุ่มนวล <br className="sm:hidden" />
          และเต็มไปด้วยรอยยิ้มในทุกๆ วันนะ 💖
        </p>

        {/* Start Button */}
        <motion.button
          onClick={onStartClick}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="group relative flex items-center gap-3 py-4 px-9 rounded-full bg-gradient-to-r from-blush-500 via-peach to-blush-600 text-white font-medium text-base sm:text-lg shadow-xl shadow-blush-500/25 hover:shadow-2xl hover:shadow-blush-500/35 transition-all cursor-pointer"
        >
          <span>กดเพื่อเริ่มดูความทรงจำ</span>
          <Heart className="w-4 h-4 fill-white/80 text-white group-hover:scale-125 transition-transform" />
        </motion.button>
      </motion.div>

      {/* Scroll Down Hint */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        onClick={onStartClick}
        className="absolute bottom-8 flex flex-col items-center gap-1 text-gray-400 hover:text-blush-600 cursor-pointer transition-colors"
      >
        <span className="text-xs font-sarabun tracking-wider uppercase font-medium">เลื่อนลงเพื่อดูต่อ</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
};
