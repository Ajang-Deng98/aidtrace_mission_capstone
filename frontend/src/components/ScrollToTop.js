import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      setShowScroll(scrollTop > 300);
      setIsAtBottom(scrollTop + windowHeight >= docHeight - 100);
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const handleScroll = () => {
    if (isAtBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  };

  if (!showScroll) return null;

  return (
    <button
      onClick={handleScroll}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: '#1E3A8A',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(30, 58, 138, 0.4)',
        zIndex: 9999,
        transition: 'all 0.3s ease',
        opacity: 0.9
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '0.9';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      aria-label={isAtBottom ? "Scroll to top" : "Scroll to bottom"}
      title={isAtBottom ? "Scroll to top" : "Scroll to bottom"}
    >
      {isAtBottom ? '↑' : '↓'}
    </button>
  );
};

export default ScrollToTop;
