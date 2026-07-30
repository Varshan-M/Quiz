import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { subjects } from '../data/quizData';
import { saveQuestions, getQuestions } from '../data/store';

export default function AdminDashboard({ playMetalClick, playImpact }) {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [numQuestions, setNumQuestions] = useState('');
  const [questionsForm, setQuestionsForm] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    if (selectedSubject) {
      // Try to load existing
      getQuestions(selectedSubject).then(existing => {
        if (existing && existing.length > 0) {
          setNumQuestions(existing.length);
          setQuestionsForm(existing);
        } else {
          setNumQuestions('');
          setQuestionsForm([]);
        }
      });
    }
  }, [selectedSubject]);

  const handleNumChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setNumQuestions('');
      setQuestionsForm([]);
      return;
    }

    const num = parseInt(val) || 0;
    setNumQuestions(num);
    
    setQuestionsForm(prev => {
      const newForm = [...prev];
      if (num > prev.length) {
        for (let i = prev.length; i < num; i++) {
          newForm.push({ id: Date.now() + i, image: null, hint: '' });
        }
      } else {
        newForm.splice(num);
      }
      return newForm;
    });
  };

  const handleImageUpload = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setQuestionsForm(prev => {
        const newForm = [...prev];
        newForm[index].image = reader.result;
        return newForm;
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (index, e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) handleImageUpload(index, file);
        break;
      }
    }
  };

  const handleHintChange = (index, value) => {
    setQuestionsForm(prev => {
      const newForm = [...prev];
      newForm[index].hint = value;
      return newForm;
    });
  };

  const handleClearImage = (index) => {
    setQuestionsForm(prev => {
      const newForm = [...prev];
      newForm[index].image = null;
      return newForm;
    });
  };

  const handleClearHint = (index) => {
    setQuestionsForm(prev => {
      const newForm = [...prev];
      newForm[index].hint = '';
      return newForm;
    });
  };

  const handleSave = async () => {
    const hasEmptyFields = questionsForm.some(q => !q.image || !q.hint.trim());
    if (hasEmptyFields) {
      setError('ERROR: PLEASE FILL ALL IMAGES AND HINTS BEFORE COMMITTING.');
      return;
    }
    setError('');
    playImpact?.();
    await saveQuestions(selectedSubject, questionsForm);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505 url(/images/bg-admin.jpg) center/cover fixed no-repeat',
      position: 'relative',
      color: '#D9D9D9',
      fontFamily: "'Inter', sans-serif",
      padding: '40px 20px'
    }}>
      {/* Dark overlay for readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(5, 5, 5, 0.4)', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <button onClick={() => navigate('/subjects')} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '8px 16px', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            HOME
          </button>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: '#B3001B', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            ADMIN COMMAND CENTER
          </h1>
        </div>

        {/* Setup Section */}
        <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px', borderRadius: '4px', marginBottom: '30px' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#fff', marginBottom: '20px' }}>1. SELECT BATTLEGROUND</h2>
          
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{ width: '100%', padding: '12px', background: '#111', border: '1px solid #333', color: '#fff', outline: 'none', marginBottom: '20px' }}
          >
            <option value="">-- Choose Subject --</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {selectedSubject && (
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#888' }}>NUMBER OF QUIZZES (QUESTIONS)</label>
              <input 
                type="number" 
                min="0" 
                max="50"
                value={numQuestions}
                onChange={handleNumChange}
                style={{ width: '100%', padding: '12px', background: '#111', border: '1px solid #333', color: '#fff', outline: 'none' }}
              />
            </div>
          )}
        </div>

        {/* Upload Section */}
        {selectedSubject && numQuestions > 0 && (
          <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px', borderRadius: '4px' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#fff', marginBottom: '20px' }}>2. UPLOAD INTEL</h2>
            
            {questionsForm.map((q, idx) => (
              <motion.div 
                key={q.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                tabIndex={0}
                onPaste={(e) => handlePaste(idx, e)}
                style={{ 
                  border: '1px solid #333', 
                  padding: '20px', 
                  marginBottom: '20px', 
                  background: '#111',
                  outline: 'none',
                  cursor: 'default'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#B3001B'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#333'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: '#B3001B', margin: 0 }}>
                    QUESTION {idx + 1}
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: '#555', fontFamily: "'JetBrains Mono', monospace" }}>[ CLICK BOX & CTRL+V TO PASTE IMAGE ]</span>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#888', fontSize: '0.9rem' }}>IMAGE UPLOAD</label>
                    <button onClick={() => handleClearImage(idx)} style={{ background: 'none', border: 'none', color: '#B3001B', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" }}>[ DELETE ]</button>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(idx, e.target.files[0])}
                    style={{ color: '#fff' }}
                  />
                  {q.image && (
                    <img src={q.image} alt="preview" style={{ marginTop: '10px', maxHeight: '150px', border: '1px solid #333' }} />
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#888', fontSize: '0.9rem' }}>HINT / TEXT</label>
                    <button onClick={() => handleClearHint(idx)} style={{ background: 'none', border: 'none', color: '#B3001B', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" }}>[ DELETE ]</button>
                  </div>
                  <textarea 
                    value={q.hint}
                    onChange={(e) => handleHintChange(idx, e.target.value)}
                    rows="3"
                    style={{ width: '100%', padding: '12px', background: '#050505', border: '1px solid #333', color: '#fff', outline: 'none' }}
                    placeholder="Enter the hint for this image..."
                  />
                </div>
              </motion.div>
            ))}

            {error && (
              <div style={{ color: '#B3001B', fontSize: '0.9rem', fontFamily: "'JetBrains Mono', monospace", marginBottom: '10px', textAlign: 'center' }}>
                {error}
              </div>
            )}
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <button 
                onClick={() => navigate('/subjects')}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1px solid #444',
                  color: '#888',
                  padding: '16px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '1rem',
                  cursor: 'pointer',
                  letterSpacing: '0.1em',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#666'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#444'; }}
              >
                RETURN HOME
              </button>
              <button 
                onClick={handleSave}
                className="btn-industrial"
                style={{ flex: 2, padding: '16px', margin: 0 }}
              >
                {isSaved ? 'SAVED SUCCESSFULLY' : 'COMMIT TO DATABASE'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
