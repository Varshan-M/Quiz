import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'varshanmurali2006@gmail.com' && password === 'Varshan@1') {
      sessionStorage.setItem('admin_auth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('ACCESS DENIED');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505 url(/images/bg-admin.jpg) center/cover no-repeat',
        position: 'relative',
        color: '#D9D9D9',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Dark overlay to ensure the login form is readable */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(5, 5, 5, 0.4)', zIndex: 0 }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid #1a1a1a',
        borderRadius: '4px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '3rem',
          color: '#B3001B',
          textAlign: 'center',
          marginBottom: '30px',
          letterSpacing: '0.05em'
        }}>
          RESTRICTED ACCESS
        </h1>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#888', letterSpacing: '0.1em' }}>ADMIN EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0a0a',
                border: '1px solid #333',
                color: '#fff',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#888', letterSpacing: '0.1em' }}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0a0a',
                border: '1px solid #333',
                color: '#fff',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>
          
          {error && (
            <div style={{ color: '#B3001B', fontSize: '0.8rem', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-industrial"
            style={{ width: '100%', padding: '16px', fontSize: '1.2rem', marginTop: '10px' }}
          >
            INITIALIZE UPLINK
          </button>
        </form>
      </div>
    </motion.div>
  );
}
