import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowDown, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export function BirthdayCake({ onScrollNext }: { onScrollNext?: () => void }) {
  const scrollToLetter = () => {
    if (onScrollNext) onScrollNext();
    else document.getElementById('birthday-letter')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="birthday-cake" className="story-section cake-snap-page">
      <div className="cake-snap-inner">
        <div className="birthday-topline">
          <Heart size={16} strokeWidth={1.3} fill="currentColor" />
          <span>saved the sweetest part for last</span>
          <Heart size={16} strokeWidth={1.3} fill="currentColor" />
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Here's to <em>your next chapter.</em>
        </motion.h2>

        <p className="birthday-description">
          ยินดีต้อนรับสู่ 25 นะมิว ขอให้เป็นปีที่ใจฟูมากกว่าเดิม
        </p>

        <div className="cake-scene-box">
          <motion.div
            className="cake-image-wrapper"
            animate={{ y: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
          >
            <img
              src="/assets/images/birthday-25-web.webp"
              alt="เค้กสตรอว์เบอร์รีกับเทียนวันเกิดเลข 25"
              draggable={false}
            />
          </motion.div>
          <div className="cake-scene-caption">
            <span className="handwritten">a little wish, just for you</span>
            <span>25 looks lovely on you.</span>
          </div>
        </div>

        <div className="cake-bottom-cue">
          <p className="cake-wish-prompt">หลับตา แล้วอธิษฐานอะไรสักอย่างสิ ✨</p>
          <button type="button" className="scroll-cue-action" onClick={scrollToLetter}>
            <span>เลื่อนต่ออีกนิด มีจดหมายถึงมิวด้วย</span>
            <ArrowDown size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function BirthdayLetter({ isActive }: { isActive?: boolean }) {
  const letterRef = useRef<HTMLElement>(null);
  const celebrated = useRef(false);
  const letterVisible = useInView(letterRef, { once: true, amount: 0.1 });
  const shouldCelebrate = isActive !== undefined ? isActive : letterVisible;

  useEffect(() => {
    if (!shouldCelebrate || celebrated.current) return;
    celebrated.current = true;
    confetti({
      particleCount: 110,
      spread: 95,
      origin: { y: 0.65 },
      colors: ['#a85367', '#d7b9ab', '#e8eadd', '#e4d3b8', '#874052'],
      zIndex: 60,
    });
  }, [shouldCelebrate]);

  return (
    <section id="birthday-letter" ref={letterRef} className="story-section letter-snap-page">
      <div className="letter-snap-inner">
        <motion.article
          className="birthday-letter-card"
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="letter-header">
            <span className="letter-to">ถึง มิมิวคนเก่ง</span>
            <span className="letter-date">22 ตุลาคม 2569</span>
          </div>

          <h3 className="letter-title">
            สุขสันต์วันเกิดมิมิว <Heart size={20} fill="currentColor" strokeWidth={0} />
          </h3>

          <div className="letter-content-body">
            <p>
              ขอให้ปีนี้เป็นปีที่ดี<br />
              เต็มไปด้วยความสำเร็จในทุกสิ่งที่ตั้งใจ 💪<br />
              คิดสิ่งใด ขอให้สมหวังทุกประการ 🌟<br />
              แคล้วคลาด ปลอดภัย และมีความสุขมาก ๆ นะ 💖
            </p>
            <p>
              มีอะไรก็มาปรึกษาได้ตลอดเลย 🤝<br />
              ลองเปิดใจ ลองทำอะไรในมุมใหม่ ๆ ดูบ้าง 🌈<br />
              ใช้ชีวิตแบบที่ไม่เคยลองมาก่อน เผื่อจะเจออะไรดี ๆ
            </p>
            <p>
              อย่าลืมอ่านหนังสือที่ซื้อให้ให้จบนะ 📚<br />
              รออ่านต่ออยู่เลย 😆
            </p>
            <p className="letter-special-note">
              สุดท้ายนี้... เปิดของที่ส่งไปที่บ้านได้เลยจ้าาา 🎁💌
            </p>
          </div>

          <div className="letter-footer">
            <span className="handwritten">always cheering for you.</span>
            <Heart size={18} fill="currentColor" />
          </div>
        </motion.article>

        <footer className="snap-site-footer">
          <span>Made with love for Mimiw · 22.10.2026</span>
        </footer>
      </div>
    </section>
  );
}

export function ScrollBirthday() {
  return (
    <>
      <BirthdayCake />
      <BirthdayLetter />
    </>
  );
}
