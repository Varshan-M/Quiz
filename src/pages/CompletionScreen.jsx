import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CompletionScreen() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        backgroundImage: 'url(/images/bg-complete.jpg)',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '40px'
      }}
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/subjects')}
        className="btn-industrial"
        style={{ 
          fontSize: '1.2rem', 
          padding: '16px 40px', 
          width: '100%', 
          maxWidth: '400px', 
          zIndex: 10,
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
        }}
      >
        RETURN HOME
      </motion.button>
    </motion.div>
  );
}
