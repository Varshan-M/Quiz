import { useEffect, useRef } from 'react';

export default function DustParticles({ count = 60 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouse);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -(Math.random() * 0.2 + 0.05),
      opacity: Math.random() * 0.5 + 0.1,
      drift: Math.random() * Math.PI * 2,
      driftSpeed: Math.random() * 0.008 + 0.002,
      glow: Math.random() > 0.7,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.drift += p.driftSpeed;
        const driftX = Math.sin(p.drift) * 0.5;
        const driftY = Math.cos(p.drift * 0.7) * 0.2;

        // Parallax from mouse
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const dx = (mx - canvas.width / 2) * 0.0003 * p.size;
        const dy = (my - canvas.height / 2) * 0.0003 * p.size;

        p.x += p.speedX + driftX + dx;
        p.y += p.speedY + driftY + dy;

        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        if (p.glow) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(179, 0, 27, 0.3)';
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 190, 170, ${p.opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  );
}
