import React from 'react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Aceptar', cancelText = 'Cancelar' }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '30px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        textAlign: 'center'
      }}>
        <h2 style={{
          color: '#3f4f36',
          marginTop: 0,
          marginBottom: '15px',
          fontSize: '1.5em'
        }}>
          {title}
        </h2>
        
        <p style={{
          color: '#5a4a3c',
          fontSize: '1em',
          marginBottom: '30px',
          lineHeight: '1.5'
        }}>
          {message}
        </p>

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              backgroundColor: '#d4c5b9',
              color: '#3f4f36',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '14px',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#c9b8ad'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#d4c5b9'}
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '14px',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
