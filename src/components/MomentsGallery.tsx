import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera, Sparkles } from 'lucide-react';

const PHOTOS = [
  { id: 1, src: '/assets/images/1.jpg', caption: 'รอยยิ้มแรก 🌸' },
  { id: 2, src: '/assets/images/2.JPG', caption: 'วันสบายๆ ☀️' },
  { id: 3, src: '/assets/images/3.jpg', caption: 'มุมน่ารัก ✨' },
  { id: 4, src: '/assets/images/4.JPG', caption: 'ความทรงจำดีๆ 💖' },
  { id: 5, src: '/assets/images/5.JPG', caption: 'สดใสเสมอ 🌷' },
  { id: 6, src: '/assets/images/6.jpg', caption: 'วันพิเศษ 🌟' },
  { id: 7, src: '/assets/images/7.PNG', caption: 'น่ารักที่สุด 🎀' },
  { id: 8, src: '/assets/images/8.JPG', caption: 'มิมิวคนเก่ง 💐' },
];

export const MomentsGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? PHOTOS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === PHOTOS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="moments"
      className="relative min-h-[100dvh] w-full py-16 px-4 bg-obsidian-900 text-white flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background starlight effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-blush-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full mx-auto flex flex-col items-center text-center">
        {/* Section Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-3 rounded-full bg-white/10 border border-white/10 text-blush-300 text-xs font-semibold backdrop-blur-md"
        >
          <Camera className="w-3.5 h-3.5 text-blush-400" />
          <span>Photo Memories</span>
        </motion.div>

        <h2 className="font-mali text-3xl sm:text-5xl font-bold mb-3 text-white">
          ภาพมิมิว 📸
        </h2>
        <p className="font-sarabun text-sm sm:text-base text-white/60 mb-8 max-w-md">
          เลื่อนซ้าย-ขวา เพื่อดูภาพความน่ารักในแต่ละโมเมนต์
        </p>

        {/* 3D Interactive Carousel Container */}
        <div className="relative w-full max-w-lg h-[380px] sm:h-[460px] flex items-center justify-center perspective-[1200px]">
          {/* Main Card Slides with Touch Swipe & 3D Depth */}
          <div className="relative w-[280px] sm:w-[340px] h-[340px] sm:h-[420px]">
            <AnimatePresence mode="popLayout">
              {PHOTOS.map((photo, index) => {
                const offset = (index - currentIndex + PHOTOS.length) % PHOTOS.length;
                let position = 0; // 0 = center, -1 = left, 1 = right, others = hidden
                if (offset === 0) position = 0;
                else if (offset === 1 || (offset === PHOTOS.length - 1 && PHOTOS.length === 2)) position = 1;
                else if (offset === PHOTOS.length - 1) position = -1;
                else return null;

                const isCenter = position === 0;

                return (
                  <motion.div
                    key={photo.id}
                    initial={{
                      scale: 0.8,
                      opacity: 0,
                      x: position * 180,
                      rotateY: position * -25,
                    }}
                    animate={{
                      scale: isCenter ? 1 : 0.85,
                      opacity: isCenter ? 1 : 0.45,
                      x: position * 110,
                      rotateY: position * -20,
                      zIndex: isCenter ? 20 : 10,
                    }}
                    exit={{
                      scale: 0.75,
                      opacity: 0,
                      x: position * 180,
                    }}
                    transition={{ type: 'spring', stiffness: 280, damping: 25 }}
                    drag={isCenter ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 50) prevSlide();
                      else if (info.offset.x < -50) nextSlide();
                    }}
                    onClick={() => {
                      if (position === -1) prevSlide();
                      if (position === 1) nextSlide();
                    }}
                    className={`absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-neutral-800 cursor-pointer select-none ${
                      isCenter ? 'ring-2 ring-blush-500/40' : ''
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
                      <p className="font-mali text-lg sm:text-xl font-bold text-white text-left">
                        {photo.caption}
                      </p>
                      <p className="font-sarabun text-xs text-white/60 text-left">
                        รูปที่ {index + 1} จาก {PHOTOS.length}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={prevSlide}
            className="absolute -left-2 sm:left-4 z-30 p-3 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 border border-white/20 backdrop-blur-md text-white transition-all shadow-lg"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={nextSlide}
            className="absolute -right-2 sm:right-4 z-30 p-3 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 border border-white/20 backdrop-blur-md text-white transition-all shadow-lg"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnail Dots Indicator */}
        <div className="flex items-center gap-2 mt-6">
          {PHOTOS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-blush-500'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
