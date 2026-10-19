import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Mail, Gift, Heart, Sparkles, Cake } from 'lucide-react';

interface BirthdayCardProps {
  onCardOpened?: () => void;
}

export const BirthdayCard: React.FC<BirthdayCardProps> = ({ onCardOpened }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      onCardOpened?.();

      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF7E67', '#E85D75', '#FFD166', '#06D6A0', '#118AB2'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <section
      id="birthday-card"
      className="relative min-h-[100dvh] w-full py-16 px-4 bg-gradient-to-b from-cream-100 via-blush-50/60 to-cream-100 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-24 w-80 h-80 bg-blush-200/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-peach/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full mx-auto flex flex-col items-center">
        {/* Section Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-3 rounded-full bg-blush-100/70 border border-blush-200 text-blush-700 text-xs font-semibold backdrop-blur-md"
        >
          <Gift className="w-3.5 h-3.5 text-blush-500" />
          <span>Birthday Message</span>
        </motion.div>

        <h2 className="font-mali text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-center">
          การ์ดอวยพรวันเกิด 💌
        </h2>
        <p className="font-sarabun text-sm text-gray-500 mb-8 text-center">
          {isOpen ? 'แตะการ์ดอีกครั้งเพื่อพับเก็บ' : 'แตะที่การ์ดเพื่อเปิดอ่านคำอวยพร'}
        </p>

        {/* 3D Interactive Card / Envelope */}
        <motion.div
          onClick={handleOpen}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full max-w-md cursor-pointer select-none"
        >
          <AnimatePresence mode="wait">
            {!isOpen ? (
              /* Closed Card (Envelope / Cake Front) */
              <motion.div
                key="closed"
                initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotateX: -20 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="relative w-full rounded-3xl p-8 bg-white/95 shadow-glass border-2 border-blush-200/80 flex flex-col items-center text-center overflow-hidden"
              >
                {/* Cake Image */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 my-4 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  >
                    <img
                      src="/assets/images/cake.png"
                      alt="Birthday Cake"
                      className="w-full h-full object-contain drop-shadow-xl"
                    />
                  </motion.div>
                </div>

                <div className="inline-flex items-center gap-2 py-3 px-6 mt-4 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-medium text-sm shadow-md shadow-blush-500/25">
                  <Mail className="w-4 h-4" />
                  <span>กดเพื่อเปิดอ่านจดหมาย</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ) : (
              /* Opened Card (Thai Letter Inside) */
              <motion.div
                key="open"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.6, type: 'spring', damping: 20 }}
                className="relative w-full rounded-3xl p-6 sm:p-8 bg-white/95 shadow-2xl border-2 border-blush-300 text-left overflow-hidden"
              >
                {/* Top letter decoration */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-blush-100">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 fill-blush-500 text-blush-500" />
                    <span className="font-mali font-bold text-gray-800 text-sm">
                      ถึง: มิมิว
                    </span>
                  </div>
                  <span className="font-sarabun text-xs text-gray-400">
                    22 ตุลาคม 2569
                  </span>
                </div>

                {/* The Exact Letter Content */}
                <h3 className="font-mali text-xl sm:text-2xl font-bold text-blush-600 mb-4">
                  สุขสันต์วันเกิดมิมิว 🎉
                </h3>

                <div className="space-y-2.5 font-sarabun text-sm sm:text-base text-gray-700 leading-relaxed">
                  <p>ขอให้ปีนี้เป็นปีที่ดี</p>
                  <p>เต็มไปด้วยความสำเร็จในทุกสิ่งที่ตั้งใจ 💪</p>
                  <p>คิดสิ่งใด ขอให้สมหวังทุกประการ 🌟</p>
                  <p>แคล้วคลาด ปลอดภัย และมีความสุขมาก ๆ นะ 💖</p>
                  <p>มีอะไรก็มาปรึกษาได้ตลอดเลย 🤝</p>
                  <p>ลองเปิดใจ ลองทำอะไรในมุมใหม่ ๆ ดูบ้าง 🌈</p>
                  <p>ใช้ชีวิตแบบที่ไม่เคยลองมาก่อน เผื่อจะเจออะไรดี ๆ</p>
                  <p>อย่าลืมอ่านหนังสือที่ซื้อให้ให้จบนะ 📚</p>
                  <p>รออ่านต่ออยู่เลย 😆</p>
                  <div className="pt-2 font-medium text-blush-700 bg-blush-50/80 p-3 rounded-2xl border border-blush-100">
                    สุดท้ายนี้... เปิดของที่ส่งไปที่บ้านได้เลยจ้าาา 🎁💌
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-blush-100 text-center">
                  <span className="text-xs text-gray-400 font-sarabun">
                    (แตะที่การ์ดเพื่อพับเก็บ)
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
