import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { subjects } from '../data/quizData';
import SubjectLoadingScreen from './SubjectLoadingScreen';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function SubjectPage({ playMetalClick, playImpact }) {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const handleSelect = (subject) => {
    playImpact?.();
    setSelectedSubject(subject);
  };

  const handleLoadingComplete = () => {
    navigate(`/rules/${selectedSubject.id}`);
  };

  return (
    <>
      <AnimatePresence>
        {selectedSubject && (
          <SubjectLoadingScreen
            subject={selectedSubject}
            onComplete={handleLoadingComplete}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* Background Image 1 — full screen */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: 'url(/images/bg-subjects.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          }}
        />

        {/* Gradient overlay: only darken the right side for text readability, keep left completely clear */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: `
              linear-gradient(90deg, 
                transparent 0%, 
                transparent 45%, 
                rgba(5,5,5,0.7) 65%, 
                rgba(5,5,5,0.9) 85%,
                rgba(5,5,5,0.95) 100%
              )
            `,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Right-side content: single column subjects */}
        <div
          style={{
            marginLeft: 'auto',
            width: '50%',
            minWidth: '360px',
            maxWidth: '550px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 40px 60px 20px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ marginBottom: '36px' }}
          >
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.4em',
                color: '#B3001B',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              ▸ Select Your Battleground ◂
            </p>
            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                color: '#D9D9D9',
                letterSpacing: '0.08em',
                lineHeight: 0.95,
                textShadow: '0 0 30px rgba(179, 0, 27, 0.1)',
              }}
            >
              CHOOSE YOUR <span style={{ color: '#B3001B' }}>SUBJECT</span>
            </h1>
            <div
              style={{
                width: '40px',
                height: '2px',
                background: 'linear-gradient(90deg, #B3001B, #8A0F1A)',
                marginTop: '12px',
              }}
            />
          </motion.div>

          {/* Subject list — single column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                variants={cardVariants}
                onMouseEnter={() => {
                  setHoveredId(subject.id);
                  playMetalClick?.();
                }}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleSelect(subject)}
                style={{
                  position: 'relative',
                  padding: '18px 22px',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: hoveredId === subject.id
                    ? 'linear-gradient(90deg, rgba(179, 0, 27, 0.12) 0%, rgba(179, 0, 27, 0.04) 100%)'
                    : 'rgba(255, 255, 255, 0.02)',
                  borderLeft: hoveredId === subject.id
                    ? '3px solid #B3001B'
                    : '3px solid transparent',
                  borderTop: '1px solid transparent',
                  borderRight: '1px solid transparent',
                  borderBottom: '1px solid transparent',
                  ...(hoveredId === subject.id && {
                    borderTop: '1px solid rgba(179, 0, 27, 0.15)',
                    borderRight: '1px solid rgba(179, 0, 27, 0.08)',
                    borderBottom: '1px solid rgba(179, 0, 27, 0.15)',
                    boxShadow: '0 0 30px rgba(179, 0, 27, 0.06), inset 0 0 20px rgba(179, 0, 27, 0.02)',
                    transform: 'translateX(-4px)',
                  }),
                }}
              >
                {/* Number */}
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.6rem',
                  color: hoveredId === subject.id ? '#B3001B' : '#333',
                  letterSpacing: '0.1em',
                  minWidth: '20px',
                  transition: 'color 0.3s',
                }}>
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Name */}
                <div style={{ flex: 1 }}>
                  <h2 style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: '2.5rem',
                    letterSpacing: '0.05em',
                    color: hoveredId === subject.id ? '#D9D9D9' : '#555',
                    transition: 'color 0.3s',
                    lineHeight: 1,
                    textTransform: 'uppercase',
                  }}>
                    {subject.name}
                  </h2>
                </div>

                {/* Arrow */}
                <span
                  style={{
                    color: hoveredId === subject.id ? '#B3001B' : '#2a2a2a',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s',
                    transform: hoveredId === subject.id ? 'translateX(4px)' : 'translateX(0)',
                  }}
                >
                  →
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1.5 }}
            style={{ marginTop: '30px' }}
          >
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.5rem',
              letterSpacing: '0.25em',
              color: '#333',
              textTransform: 'uppercase',
            }}>
              20 questions each • Choose wisely
            </p>
          </motion.div>
        </div>

      </motion.div>
    </>
  );
}
