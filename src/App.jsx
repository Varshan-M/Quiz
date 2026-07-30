import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useSoundManager } from './hooks/useSoundManager';
import SmokeCanvas from './systems/SmokeCanvas';


import LoadingScreen from './pages/LoadingScreen';
import HeroPage from './pages/HeroPage';
import SubjectPage from './pages/SubjectPage';
import RulesPage from './pages/RulesPage';
import QuizPage from './pages/QuizPage';
import CompletionScreen from './pages/CompletionScreen';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
function AnimatedRoutes({ sound }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={<LoadingScreen playDeepBass={sound.playDeepBass} />}
        />
        <Route
          path="/hero"
          element={
            <HeroPage
              playImpact={sound.playImpact}
              playMetalClick={sound.playMetalClick}
            />
          }
        />
        <Route
          path="/subjects"
          element={
            <SubjectPage
              playMetalClick={sound.playMetalClick}
              playImpact={sound.playImpact}
            />
          }
        />
        <Route
          path="/rules/:subjectId"
          element={
            <RulesPage
              playImpact={sound.playImpact}
            />
          }
        />
        <Route
          path="/quiz/:subjectId"
          element={
            <QuizPage
              playMetalClick={sound.playMetalClick}
              playImpact={sound.playImpact}
              playDeepBass={sound.playDeepBass}
            />
          }
        />
        <Route
          path="/complete"
          element={
            <CompletionScreen playDeepBass={sound.playDeepBass} />
          }
        />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard playMetalClick={sound.playMetalClick} playImpact={sound.playImpact} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function LenisInit() {
  useEffect(() => {
    let lenis;
    const init = async () => {
      try {
        const { default: Lenis } = await import('lenis');
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      } catch (e) {
        // Lenis is optional
      }
    };
    init();
    return () => lenis?.destroy();
  }, []);
  return null;
}

export default function App() {
  const sound = useSoundManager();

  return (
    <Router>
      <div style={{ position: 'relative', minHeight: '100vh', background: '#050505' }}>
        {/* Global background systems */}
        <SmokeCanvas opacity={0.25} density={35} />


        {/* Smooth scroll */}
        <LenisInit />

        {/* Routes */}
        <AnimatedRoutes sound={sound} />
      </div>
    </Router>
  );
}
