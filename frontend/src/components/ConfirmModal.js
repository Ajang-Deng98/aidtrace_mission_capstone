import React from 'react';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        border: '2px solid #1E3A8A'
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: '#1E3A8A'
        }}>
          {title}
        </h3>
        <p style={{
          margin: '0 0 24px 0',
          fontSize: '14px',
          color: '#000',
          lineHeight: '1.5'
        }}>
          {message}
        </p>
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              color: '#666',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#f5f5f5';
              e.target.style.borderColor = '#1E3A8A';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#ffffff';
              e.target.style.borderColor = '#e0e0e0';
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 20px',
              background: '#1E3A8A',
              border: 'none',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#163166';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#1E3A8A';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
