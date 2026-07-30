import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

export default function CompletionScreen({ playDeepBass }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { score = 0, total = 20, subject = 'Unknown', subjectIcon = '🧠', time = 0 } = location.state || {};
  const [displayScore, setDisplayScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const canvasRef = useRef(null);
  const hasPlayed = useRef(false);
  const percentage = Math.round((score / total) * 100);

  // Animated score counter
  useEffect(() => {
    if (!hasPlayed.current) {
      hasPlayed.current = true;
      playDeepBass?.();
    }
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setDisplayScore(current);
      if (current >= score) {
        clearInterval(interval);
        setTimeout(() => setShowDetails(true), 500);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [score, playDeepBass]);

  // Spark particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const sparks = Array.from({ length: 40 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      size: Math.random() * 3 + 1,
      life: 1,
      decay: Math.random() * 0.015 + 0.005,
      color: Math.random() > 0.5 ? '#B3001B' : '#D9D9D9',
    }));

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparks.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05; // gravity
        s.life -= s.decay;
        if (s.life <= 0) {
          s.x = canvas.width / 2 + (Math.random() - 0.5) * 100;
          s.y = canvas.height / 2;
          s.vx = (Math.random() - 0.5) * 6;
          s.vy = (Math.random() - 0.5) * 6 - 3;
          s.life = 1;
        }
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getRank = () => {
    if (percentage >= 90) return { title: 'LEGENDARY', color: '#FFD700' };
    if (percentage >= 70) return { title: 'CHAMPION', color: '#B3001B' };
    if (percentage >= 50) return { title: 'CONTENDER', color: '#D9D9D9' };
    if (percentage >= 30) return { title: 'SURVIVOR', color: '#6D6D6D' };
    return { title: 'FALLEN', color: '#444' };
  };

  const rank = getRank();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 20px',
      }}
    >
      {/* Spark particles canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.6,
        }}
      />

      {/* Red ambient glow */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(179, 0, 27, 0.1) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%',
      }}>
        {/* Pre-title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.4em',
            color: '#B3001B',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          The Arena Has Spoken
        </motion.p>

        {/* Score display */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
        >
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(6rem, 15vw, 12rem)',
            color: '#D9D9D9',
            lineHeight: 0.9,
            textShadow: `0 0 60px rgba(179, 0, 27, 0.3), 0 0 120px rgba(179, 0, 27, 0.1)`,
          }}>
            {displayScore}<span style={{ color: '#444', fontSize: '40%' }}>/{total}</span>
          </div>
        </motion.div>

        {/* Rank */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          style={{
            marginTop: '8px',
            marginBottom: '30px',
          }}
        >
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            letterSpacing: '0.2em',
            color: rank.color,
            textShadow: `0 0 20px ${rank.color}40`,
          }}>
            {rank.title}
          </span>
        </motion.div>

        {/* Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Stats grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1px',
                background: '#1a1a1a',
                border: '1px solid #1a1a1a',
                marginBottom: '32px',
              }}>
                {[
                  { label: 'Subject', value: `${subjectIcon} ${subject}` },
                  { label: 'Accuracy', value: `${percentage}%` },
                  { label: 'Time', value: formatTime(time) },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      background: '#0a0a0a',
                      padding: '20px 16px',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.55rem',
                      letterSpacing: '0.2em',
                      color: '#6D6D6D',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    }}>
                      {label}
                    </p>
                    <p style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '1.2rem',
                      color: '#D9D9D9',
                      letterSpacing: '0.05em',
                    }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Percentage bar */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: '#111',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: percentage >= 70
                        ? 'linear-gradient(90deg, #2d8a4e, #4ade80)'
                        : percentage >= 50
                        ? 'linear-gradient(90deg, #ca8a04, #facc15)'
                        : 'linear-gradient(90deg, #8A0F1A, #B3001B)',
                      borderRadius: '2px',
                    }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/subjects')}
                  className="btn-industrial"
                  style={{ fontSize: '1.1rem', padding: '14px 40px' }}
                >
                  FIGHT AGAIN
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/hero')}
                  data-hoverable
                  style={{
                    background: 'none',
                    border: '1px solid #333',
                    color: '#6D6D6D',
                    padding: '14px 40px',
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.1rem',
                    letterSpacing: '0.15em',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#B3001B';
                    e.currentTarget.style.color = '#D9D9D9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#333';
                    e.currentTarget.style.color = '#6D6D6D';
                  }}
                >
                  EXIT ARENA
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="vignette" />
    </motion.div>
  );
}
