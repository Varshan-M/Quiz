import { useEffect, useState, useCallback } from 'react';

export default function CursorSystem() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleMouseMove = useCallback((e) => {
    setPos({ x: e.clientX, y: e.clientY });
    if (!visible) setVisible(true);
  }, [visible]);

  useEffect(() => {
    // Check if touch device
    if ('ontouchstart' in window) return;

    window.addEventListener('mousemove', handleMouseMove);

    const handleOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-hoverable]') ||
        target.closest('.steel-card')
      ) {
        setHovering(true);
      }
    };

    const handleOut = () => setHovering(false);

    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, [handleMouseMove]);

  if (!visible) return null;

  return (
    <>
      <div
        className={`custom-cursor ${hovering ? 'hovering' : ''}`}
        style={{ left: pos.x, top: pos.y }}
      />
      <div
        className="cursor-glow"
        style={{
          left: pos.x,
          top: pos.y,
          transition: 'left 0.15s ease-out, top 0.15s ease-out',
        }}
      />
    </>
  );
}
