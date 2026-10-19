import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

const photos = [
  { src: '1-web.webp', caption: 'รอยยิ้มแรก' },
  { src: '2-web.webp', caption: 'วันสบาย ๆ' },
  { src: '3.jpg', caption: 'มุมน่ารัก' },
  { src: '4-web.webp', caption: 'ความทรงจำดี ๆ' },
  { src: '5-web.webp', caption: 'สดใสเสมอ' },
  { src: '6-web.webp', caption: 'วันพิเศษ' },
  { src: '7-web.webp', caption: 'น่ารักที่สุด' },
  { src: '8-web.webp', caption: 'มิมิวคนเก่ง' },
];

export function ScrollMemories({ onScrollNext }: { onScrollNext?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const scrollToNext = () => {
    if (onScrollNext) onScrollNext();
    else document.getElementById('birthday-cake')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="moments" className="story-section moments-snap-page" aria-labelledby="memories-title">
      <div className="momories-snap-inner">
        <div className="memories-heading">
          <h2 id="memories-title">
            Some days fade. <em>These stay.</em>
          </h2>
          <p>
            บางวันอาจจำไม่ได้แล้วว่าทำอะไร<br />
            แต่รอยยิ้มในรูปพวกนี้ ยังทำให้ยิ้มตามได้อยู่เลย
          </p>
        </div>

        {/* Interactive Photo Carousel */}
        <div className="memories-carousel-stage">
          <button
            type="button"
            className="carousel-nav-btn prev-btn"
            onClick={prevPhoto}
            aria-label="รูปก่อนหน้า"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="polaroid-slider-wrapper">
            <AnimatePresence mode="wait">
              <motion.figure
                key={currentIndex}
                className="snap-polaroid"
                initial={{ opacity: 0, scale: 0.92, x: 25 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.92, x: -25 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 45) prevPhoto();
                  else if (info.offset.x < -45) nextPhoto();
                }}
              >
                <span className="paper-tape" aria-hidden="true" />
                <img
                  src={`/assets/images/${photos[currentIndex].src}`}
                  alt={photos[currentIndex].caption}
                  draggable={false}
                />
                <figcaption>
                  <span>{photos[currentIndex].caption}</span>
                  <span className="polaroid-count">
                    {currentIndex + 1} / {photos.length}
                  </span>
                  <Heart size={16} fill="currentColor" />
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="carousel-nav-btn next-btn"
            onClick={nextPhoto}
            aria-label="รูปถัดไป"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Dots Pagination */}
        <div className="carousel-dots-bar" role="tablist" aria-label="เลือกรูปภาพ">
          {photos.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`carousel-dot ${idx === currentIndex ? 'is-active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`รูปที่ ${idx + 1}`}
            />
          ))}
        </div>

        {/* Bottom Cue to Scroll Next */}
        <div className="memories-bottom-cue">
          <span className="handwritten">
            เก็บไว้ตรงนี้ จะได้ไม่ลืม <Heart size={13} fill="currentColor" />
          </span>
          <button type="button" className="scroll-cue-action" onClick={scrollToNext}>
            <span>เลื่อนลง เพื่อดูเค้กวันเกิด</span>
            <ArrowDown size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
