import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { subjects, quizQuestions } from '../data/quizData';

export default function QuizPage({ playMetalClick, playImpact, playDeepBass }) {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const subject = subjects.find(s => s.id === subjectId);
  const questions = quizQuestions[subjectId] || [];

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [startTime] = useState(Date.now());

  const question = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  const handleAnswer = useCallback((index) => {
    if (answered) return;
    playMetalClick?.();
    setSelectedAnswer(index);
    setAnswered(true);
    if (index === question.correct) {
      setScore(prev => prev + 1);
    }
  }, [answered, question, playMetalClick]);

  const handleNext = useCallback(() => {
    if (currentQ >= questions.length - 1) {
      playDeepBass?.();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      navigate('/complete', {
        state: {
          score,
          total: questions.length,
          subject: subject.name,
          subjectIcon: subject.icon,
          time: elapsed,
        },
      });
      return;
    }
    playImpact?.();
    setTransitioning(true);
    setTimeout(() => {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
      setShowHint(false);
      setAnswered(false);
      setTransitioning(false);
    }, 400);
  }, [currentQ, questions.length, navigate, score, subject, startTime, playImpact, playDeepBass]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Enter' && answered) handleNext();
      if (e.key >= '1' && e.key <= '4' && !answered) {
        handleAnswer(parseInt(e.key) - 1);
      }
      if (e.key === 'h' && !showHint) setShowHint(true);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [answered, showHint, handleAnswer, handleNext]);

  if (!subject || !question) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6D6D6D',
      }}>
        Subject not found.
      </div>
    );
  }

  const getOptionStyle = (index) => {
    if (!answered) {
      return {
        border: '1px solid #222',
        background: 'rgba(17, 17, 17, 0.8)',
      };
    }
    if (index === question.correct) {
      return {
        border: '1px solid #2d8a4e',
        background: 'rgba(45, 138, 78, 0.1)',
      };
    }
    if (index === selectedAnswer && index !== question.correct) {
      return {
        border: '1px solid #B3001B',
        background: 'rgba(179, 0, 27, 0.1)',
      };
    }
    return {
      border: '1px solid #1a1a1a',
      background: 'rgba(17, 17, 17, 0.4)',
      opacity: 0.5,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#050505',
        position: 'relative',
      }}
    >
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 30px',
        borderBottom: '1px solid #111',
        position: 'relative',
        zIndex: 20,
      }}>
        {/* Left: Back + Subject */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/subjects')}
            data-hoverable
            style={{
              background: 'none',
              border: '1px solid #222',
              color: '#6D6D6D',
              padding: '8px 16px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#B3001B';
              e.currentTarget.style.color = '#D9D9D9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#222';
              e.currentTarget.style.color = '#6D6D6D';
            }}
          >
            ← Exit Arena
          </motion.button>
          <div>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1.1rem',
              color: '#D9D9D9',
              letterSpacing: '0.1em',
            }}>
              {subject.icon} {subject.name}
            </span>
          </div>
        </div>

        {/* Right: Score + Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            color: '#B3001B',
            letterSpacing: '0.1em',
          }}>
            SCORE: {score}
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            color: '#6D6D6D',
            letterSpacing: '0.1em',
          }}>
            {String(currentQ + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main quiz content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 10,
      }}>
        <AnimatePresence mode="wait">
          {!transitioning && (
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              style={{
                maxWidth: '800px',
                width: '100%',
              }}
            >
              {/* Question number accent */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px',
                  transformOrigin: 'left',
                }}
              >
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '3rem',
                  color: '#B3001B',
                  lineHeight: 1,
                  opacity: 0.3,
                }}>
                  {String(currentQ + 1).padStart(2, '0')}
                </span>
                <div style={{
                  flex: 1,
                  height: '1px',
                  background: 'linear-gradient(90deg, #B3001B, transparent)',
                  opacity: 0.3,
                }} />
              </motion.div>

              {/* Question */}
              <h2 style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                color: '#D9D9D9',
                fontWeight: 500,
                lineHeight: 1.4,
                marginBottom: '40px',
              }}>
                {question.question}
              </h2>

              {/* Options */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '12px',
                marginBottom: '32px',
              }}>
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={!answered ? { scale: 1.01, x: 4 } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(index)}
                    data-hoverable
                    disabled={answered}
                    style={{
                      ...getOptionStyle(index),
                      padding: '18px 24px',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      cursor: answered ? 'default' : 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      borderRadius: '2px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Option letter */}
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.7rem',
                      color: answered && index === question.correct ? '#2d8a4e' :
                             answered && index === selectedAnswer ? '#B3001B' : '#444',
                      letterSpacing: '0.1em',
                      minWidth: '20px',
                    }}>
                      {String.fromCharCode(65 + index)}
                    </span>

                    {/* Option text */}
                    <span style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.9rem',
                      color: answered && index === question.correct ? '#2d8a4e' :
                             answered && index === selectedAnswer && index !== question.correct ? '#B3001B' :
                             !answered ? '#D9D9D9' : '#6D6D6D',
                      transition: 'color 0.3s',
                    }}>
                      {option}
                    </span>

                    {/* Correct/Wrong indicator */}
                    {answered && index === question.correct && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          marginLeft: 'auto',
                          color: '#2d8a4e',
                          fontSize: '1rem',
                        }}
                      >
                        ✓
                      </motion.span>
                    )}
                    {answered && index === selectedAnswer && index !== question.correct && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          marginLeft: 'auto',
                          color: '#B3001B',
                          fontSize: '1rem',
                        }}
                      >
                        ✗
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Actions row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
              }}>
                {/* Hint button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowHint(true);
                    playMetalClick?.();
                  }}
                  data-hoverable
                  disabled={showHint}
                  style={{
                    background: 'none',
                    border: '1px solid #222',
                    color: showHint ? '#444' : '#6D6D6D',
                    padding: '10px 24px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                    cursor: showHint ? 'default' : 'pointer',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s',
                    opacity: showHint ? 0.5 : 1,
                  }}
                >
                  {showHint ? '💡 Hint Revealed' : '💡 Reveal Hint'}
                </motion.button>

                {/* Next button */}
                {answered && (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNext}
                    className="btn-industrial"
                    style={{
                      fontSize: '1rem',
                      padding: '12px 36px',
                    }}
                  >
                    {currentQ >= questions.length - 1 ? 'FINISH' : 'NEXT →'}
                  </motion.button>
                )}
              </div>

              {/* Hint area */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      padding: '16px 20px',
                      borderLeft: '2px solid #B3001B',
                      background: 'rgba(179, 0, 27, 0.03)',
                    }}>
                      <p style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.6rem',
                        letterSpacing: '0.15em',
                        color: '#B3001B',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                      }}>
                        Hint
                      </p>
                      <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.85rem',
                        color: '#6D6D6D',
                        fontStyle: 'italic',
                        lineHeight: 1.5,
                      }}>
                        {question.hint}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Keyboard shortcuts */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1 }}
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  gap: '20px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { key: '1-4', label: 'Select' },
                  { key: 'H', label: 'Hint' },
                  { key: 'Enter', label: 'Next' },
                ].map(({ key, label }) => (
                  <span
                    key={key}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.5rem',
                      color: '#444',
                      letterSpacing: '0.1em',
                    }}
                  >
                    <span style={{
                      padding: '2px 6px',
                      border: '1px solid #222',
                      borderRadius: '2px',
                      marginRight: '4px',
                    }}>
                      {key}
                    </span>
                    {label}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ambient background elements */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(179, 0, 27, 0.02) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="vignette" />
    </motion.div>
  );
}
