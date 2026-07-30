import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { subjects } from '../data/quizData';
import { getQuestions } from '../data/store';

export default function QuizPage({ playMetalClick, playImpact, playDeepBass }) {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const subject = subjects.find(s => s.id === subjectId);
  
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    getQuestions(subjectId).then(data => {
      setQuestions(data);
      setIsLoading(false);
    });
  }, [subjectId]);

  const question = questions[currentQ];
  const progress = questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0;

  const handleNext = useCallback(() => {
    if (currentQ >= questions.length - 1) {
      playDeepBass?.();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      navigate('/complete', {
        state: {
          total: questions.length,
          subject: subject.name,
          time: elapsed,
        },
      });
      return;
    }
    playImpact?.();
    setTransitioning(true);
    setTimeout(() => {
      setCurrentQ(prev => prev + 1);
      setShowHint(false);
      setTransitioning(false);
    }, 400);
  }, [currentQ, questions.length, navigate, subject, startTime, playImpact, playDeepBass]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Enter') handleNext();
      if (e.key === 'h' && !showHint) {
        playMetalClick?.();
        setShowHint(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showHint, handleNext, playMetalClick]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', color: '#6D6D6D' }}>
        LOADING INTEL...
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505',
        color: '#D9D9D9',
        fontFamily: "'Bebas Neue', sans-serif",
      }}>
        <h1 style={{ fontSize: '3rem', color: '#B3001B', marginBottom: '20px' }}>NO QUESTIONS UPLOADED YET</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", color: '#6D6D6D' }}>Please add questions via the Admin Dashboard.</p>
        <button 
          onClick={() => navigate('/subjects')} 
          className="btn-industrial"
          style={{ marginTop: '40px', fontSize: '1.2rem', padding: '12px 30px' }}
        >
          BACK TO SUBJECTS
        </button>
      </div>
    );
  }

  if (!subject || !question) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: '#050505',
        position: 'relative',
      }}
    >
      {/* Top bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', color: '#D9D9D9', letterSpacing: '0.1em' }}>
            {subject.name}
          </div>
          <div style={{ width: '1px', height: '20px', background: '#333' }} />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#B3001B', letterSpacing: '0.2em' }}>
            IMAGE {String(currentQ + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '2px', background: '#111', width: '100%' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ height: '100%', background: '#B3001B' }}
        />
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 40px',
        position: 'relative',
      }}>
        <AnimatePresence mode="wait">
          {!transitioning && (
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              style={{
                width: '100%',
                height: '100%',
                maxWidth: '1200px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Image Display */}
              {question.image ? (
                <div style={{
                  width: '100%',
                  flex: 1,
                  minHeight: 0,
                  border: '1px solid #222',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  background: '#0a0a0a',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
                }}>
                  <img 
                    src={question.image} 
                    alt="Quiz Content" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              ) : (
                <div style={{ width: '100%', height: '40vh', border: '1px dashed #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                  NO IMAGE UPLOADED
                </div>
              )}

              {/* Hint Display */}
              {showHint ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    width: '100%',
                    padding: '24px',
                    background: 'rgba(179, 0, 27, 0.05)',
                    border: '1px solid rgba(179, 0, 27, 0.2)',
                    borderRadius: '4px',
                    textAlign: 'center',
                  }}
                >
                  <h4 style={{ fontFamily: "'JetBrains Mono', monospace", color: '#B3001B', fontSize: '0.8rem', marginBottom: '10px', letterSpacing: '0.2em' }}>HINT REVEALED</h4>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.5rem', fontWeight: 'bold', color: '#FFF', lineHeight: 1.6 }}>
                    {question.hint || 'No hint provided.'}
                  </p>
                </motion.div>
              ) : (
                <button
                  onClick={() => { playMetalClick?.(); setShowHint(true); }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #333',
                    padding: '12px 30px',
                    color: '#888',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.9rem',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#666'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#888'; }}
                >
                  [ SHOW HINT (H) ]
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom control bar */}
      <div style={{
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(0deg, #050505 0%, transparent 100%)',
        borderTop: '1px solid rgba(255,255,255,0.02)',
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#444', letterSpacing: '0.1em' }}>
          PRESS [ENTER] TO ADVANCE
        </div>

        <button
          onClick={handleNext}
          className="btn-industrial"
          style={{ padding: '12px 40px', fontSize: '1.2rem' }}
        >
          {currentQ === questions.length - 1 ? 'FINISH' : 'NEXT →'}
        </button>
      </div>
    </motion.div>
  );
}
