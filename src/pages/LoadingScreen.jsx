import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function LoadingScreen({ playDeepBass }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0); // 0: black, 1: smoke, 2: text, 3: exit
  const navigate = useNavigate();
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setPhase(1), 400));
    timers.push(setTimeout(() => setPhase(2), 1200));

    // Progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 3 + 1;
      });
    }, 60);

    // Auto-navigate after loading
    timers.push(setTimeout(() => {
      setPhase(3);
      setTimeout(() => navigate('/hero'), 600);
    }, 4500));

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, [navigate]);

  useEffect(() => {
    if (phase === 2 && !hasPlayedSound.current) {
      hasPlayedSound.current = true;
      playDeepBass?.();
    }
  }, [phase, playDeepBass]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: '#050505',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
          }}
        >
          {/* Smoke wisps */}
          <AnimatePresence>
            {phase >= 1 && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`smoke-${i}`}
                    initial={{ opacity: 0, y: 100, scale: 0.5 }}
                    animate={{
                      opacity: [0, 0.15, 0.08, 0],
                      y: [100, -200],
                      scale: [0.5, 2],
                      x: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 15)],
                    }}
                    transition={{
                      duration: 4,
                      delay: i * 0.3,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    style={{
                      position: 'absolute',
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(80,80,80,0.3) 0%, transparent 70%)',
                      filter: 'blur(30px)',
                      left: `${20 + i * 12}%`,
                      bottom: '20%',
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Title */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}
              >
                <motion.h1
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                    letterSpacing: '0.15em',
                    color: '#D9D9D9',
                    lineHeight: 0.95,
                    textShadow: '0 0 40px rgba(179, 0, 27, 0.3)',
                  }}
                >
                  {'UNDERGROUND'.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                  <br />
                  {'QUIZ ARENA'.split('').map((char, i) => (
                    <motion.span
                      key={`q-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.04, duration: 0.3 }}
                      style={{ color: char !== ' ' ? '#B3001B' : undefined }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.h1>

                {/* Loading bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  style={{
                    marginTop: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div className="loading-bar-container">
                    <div
                      className="loading-bar-progress"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.7rem',
                      letterSpacing: '0.2em',
                      color: '#6D6D6D',
                      textTransform: 'uppercase',
                    }}
                  >
                    Initializing Arena... {Math.min(Math.floor(progress), 100)}%
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vignette */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
            pointerEvents: 'none',
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
