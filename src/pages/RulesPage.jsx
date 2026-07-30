import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';

export default function RulesPage({ playImpact }) {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const handleNext = () => {
    playImpact?.();
    navigate(`/quiz/${subjectId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
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
      {/* Rules image — displayed prominently */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '900px',
          maxHeight: '70vh',
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: '0 20px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(179, 0, 27, 0.08)',
          border: '1px solid #1a1a1a',
        }}
      >
        <img
          src="/images/bg-rules.jpg"
          alt="Arena Rules"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            background: '#0a0a0a',
          }}
        />

        {/* Subtle border glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: '1px solid rgba(179, 0, 27, 0.15)',
            borderRadius: '4px',
            pointerEvents: 'none',
          }}
        />
      </motion.div>

      {/* NEXT button — below the image */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        style={{
          marginTop: '36px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          className="btn-industrial"
          style={{
            fontSize: '1.4rem',
            padding: '16px 60px',
          }}
        >
          NEXT →
        </motion.button>

        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.5rem',
            letterSpacing: '0.25em',
            color: '#444',
            textTransform: 'uppercase',
          }}
        >
          Read the rules, then proceed
        </p>
      </motion.div>

      {/* Vignette */}
      <div className="vignette" />
    </motion.div>
  );
}
