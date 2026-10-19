import React, { useEffect, useRef } from 'react';

interface FireworksCanvasProps {
  active?: boolean;
}

export const FireworksCanvas: React.FC<FireworksCanvasProps> = ({ active = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle system
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
    }

    interface Firework {
      x: number;
      y: number;
      targetY: number;
      vy: number;
      exploded: boolean;
      color: string;
    }

    const fireworks: Firework[] = [];
    const particles: Particle[] = [];
    const colors = ['#FF7E67', '#E85D75', '#FFD166', '#06D6A0', '#118AB2', '#B56BFF'];

    const createFirework = () => {
      const x = Math.random() * width;
      const targetY = height * 0.15 + Math.random() * (height * 0.4);
      const color = colors[Math.floor(Math.random() * colors.length)];
      fireworks.push({
        x,
        y: height,
        targetY,
        vy: -7 - Math.random() * 4,
        exploded: false,
        color,
      });
    };

    const explode = (x: number, y: number, color: string) => {
      const count = 45;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 1.5 + Math.random() * 4.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: 1.5 + Math.random() * 2,
        });
      }
    };

    let tick = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(15, 14, 23, 0.2)'; // trailing effect
      ctx.fillRect(0, 0, width, height);

      tick++;
      if (tick % 45 === 0) {
        createFirework();
      }

      // Update & draw fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        fw.y += fw.vy;
        ctx.beginPath();
        ctx.arc(fw.x, fw.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = fw.color;
        ctx.fill();

        if (fw.y <= fw.targetY) {
          explode(fw.x, fw.y, fw.color);
          fireworks.splice(i, 1);
        }
      }

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.alpha -= 0.016;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 w-full h-full"
    />
  );
};
