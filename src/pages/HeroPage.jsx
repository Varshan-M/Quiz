import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HeroPage({ playImpact, playMetalClick }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isEntered, setIsEntered] = useState(false);

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const handleEnter = () => {
    playImpact?.();
    setIsEntered(true);
    setTimeout(() => navigate('/subjects'), 800);
  };

  const spotlightX = mousePos.x * 100;
  const spotlightY = mousePos.y * 100;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: isEntered ? 0 : 1 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic spotlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 600px 600px at ${spotlightX}% ${spotlightY}%, rgba(179, 0, 27, 0.06) 0%, transparent 70%)`,
          pointerEvents: 'none',
          transition: 'background 0.3s ease-out',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          pointerEvents: 'none',
        }}
      />

      {/* Red accent lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '25%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(179, 0, 27, 0.3), transparent)',
          transformOrigin: 'center',
        }}
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          bottom: '25%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(179, 0, 27, 0.3), transparent)',
          transformOrigin: 'center',
        }}
      />

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '0 20px',
        transform: `translate(${(mousePos.x - 0.5) * -10}px, ${(mousePos.y - 0.5) * -10}px)`,
        transition: 'transform 0.3s ease-out',
      }}>
        {/* Pre-title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            letterSpacing: '0.4em',
            color: '#B3001B',
            marginBottom: '20px',
            textTransform: 'uppercase',
          }}
        >
          ▸ Welcome to the Arena ◂
        </motion.p>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
          className="glitch-text"
          data-text="UNDERGROUND QUIZ ARENA"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(3rem, 10vw, 9rem)',
            lineHeight: 0.9,
            letterSpacing: '0.05em',
            color: '#D9D9D9',
            textShadow: '0 0 60px rgba(179, 0, 27, 0.2)',
            marginBottom: '24px',
          }}
        >
          UNDERGROUND<br />
          <span style={{ color: '#B3001B' }}>QUIZ ARENA</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)',
            color: '#6D6D6D',
            fontWeight: 300,
            letterSpacing: '0.1em',
            marginBottom: '60px',
            fontStyle: 'italic',
          }}
        >
          "Knowledge is your greatest weapon."
        </motion.p>

        {/* ENTER button */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleEnter}
          onMouseEnter={() => playMetalClick?.()}
          className="btn-industrial"
          style={{
            minWidth: '240px',
            fontSize: '1.8rem',
            padding: '20px 64px',
            position: 'relative',
          }}
        >
          <span style={{ position: 'relative', zIndex: 2 }}>ENTER</span>
        </motion.button>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0.2, 0.4] }}
          transition={{ delay: 2, duration: 3, repeat: Infinity }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            color: '#6D6D6D',
            marginTop: '40px',
            textTransform: 'uppercase',
          }}
        >
          Step into the unknown
        </motion.p>
      </div>

      {/* Corner decorations */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner, i) => (
        <motion.div
          key={corner}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.8 + i * 0.2 }}
          style={{
            position: 'absolute',
            [corner.includes('top') ? 'top' : 'bottom']: '30px',
            [corner.includes('left') ? 'left' : 'right']: '30px',
            width: '40px',
            height: '40px',
            borderTop: corner.includes('top') ? '1px solid #333' : 'none',
            borderBottom: corner.includes('bottom') ? '1px solid #333' : 'none',
            borderLeft: corner.includes('left') ? '1px solid #333' : 'none',
            borderRight: corner.includes('right') ? '1px solid #333' : 'none',
          }}
        />
      ))}

      {/* Vignette */}
      <div className="vignette" />
    </motion.div>
  );
}
