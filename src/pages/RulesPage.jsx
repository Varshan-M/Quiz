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
      {/* Rules image — full screen background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/bg-rules.jpg)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#050505',
          zIndex: 0,
        }}
      />

      {/* NEXT button — positioned at bottom right */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
          zIndex: 10,
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
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          NEXT →
        </motion.button>

        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            color: '#111',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            background: 'rgba(255,255,255,0.7)',
            padding: '4px 8px',
            borderRadius: '2px',
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
