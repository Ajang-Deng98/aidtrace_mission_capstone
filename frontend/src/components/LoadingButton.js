import React from 'react';

const LoadingButton = ({ 
  onClick, 
  loading, 
  children, 
  className = 'btn',
  style = {},
  disabled = false,
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={className}
      style={{
        ...style,
        opacity: loading ? 0.7 : 1,
        cursor: loading ? 'not-allowed' : 'pointer',
        position: 'relative'
      }}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            style={{ animation: 'spin 1s linear infinite' }}
          >
            <circle cx="12" cy="12" r="10" strokeWidth="3" stroke="currentColor" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Loading...
        </span>
      ) : children}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};

export default LoadingButton;
