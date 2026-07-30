import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SubjectLoadingScreen({ subject, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const contentTimer = setTimeout(() => setShowContent(true), 300);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = prev < 30 ? 2 : prev < 70 ? 3 : prev < 90 ? 2 : 1;
        return Math.min(prev + increment + Math.random() * 2, 100);
      });
    }, 50);

    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 3500);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(completeTimer);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        overflow: 'hidden',
      }}
    >
      {/* Background Image 2 — brighter */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: '-5%',
          backgroundImage: 'url(/images/bg-loading.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'contrast(1.05)',
        }}
      />

      {/* Light overlay — much less dark to keep image bright */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(180deg, 
              rgba(5,5,5,0.15) 0%, 
              rgba(5,5,5,0.05) 30%, 
              rgba(5,5,5,0.05) 60%,
              rgba(5,5,5,0.6) 90%,
              rgba(5,5,5,0.85) 100%
            )
          `,
        }}
      />

      {/* Center content — subject name */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          {/* Subject icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            style={{
              fontSize: '3.5rem',
              marginBottom: '16px',
              filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))',
            }}
          >
            {subject.icon}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                letterSpacing: '0.4em',
                color: '#B3001B',
                textTransform: 'uppercase',
                marginBottom: '10px',
                textShadow: '0 1px 4px rgba(0,0,0,0.7)',
              }}
            >
              Preparing Arena
            </p>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                color: '#D9D9D9',
                letterSpacing: '0.1em',
                textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)',
                lineHeight: 1,
              }}
            >
              {subject.name.toUpperCase()}
            </h2>
          </motion.div>
        </motion.div>
      )}

      {/* Loading bar — pinned to bottom */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            padding: '0 0 40px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {/* Bar */}
          <div
            style={{
              width: '80%',
              maxWidth: '500px',
              height: '3px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '2px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                width: `${Math.min(progress, 100)}%`,
                background: 'linear-gradient(90deg, #8A0F1A, #B3001B, #d4001f)',
                borderRadius: '2px',
                boxShadow: '0 0 10px rgba(179, 0, 27, 0.5), 0 0 30px rgba(179, 0, 27, 0.2)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>

          {/* Percentage + loading messages */}
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                color: '#6D6D6D',
              }}
            >
              {Math.min(Math.floor(progress), 100)}%
            </p>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.5rem',
                letterSpacing: '0.15em',
                color: '#444',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}
            >
              {progress < 30 && 'Loading questions...'}
              {progress >= 30 && progress < 60 && 'Generating challenges...'}
              {progress >= 60 && progress < 90 && 'Calibrating difficulty...'}
              {progress >= 90 && 'Arena ready.'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Vignette — lighter */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />
    </motion.div>
  );
}
