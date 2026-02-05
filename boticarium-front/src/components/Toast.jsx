import { useEffect } from 'react';

export function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toastEl = document.createElement('div');
  const id = Date.now();
  toastEl.id = `toast-${id}`;

  const backgroundColor = type === 'success' ? 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)' : 
                          type === 'error' ? 'linear-gradient(135deg, #d97a6f 0%, #c95c4a 100%)' :
                          type === 'info' ? 'linear-gradient(135deg, #654321 0%, #B87333 100%)' :
                          type === 'clear' ? 'linear-gradient(135deg, #8B6F47 0%, #CD7F32 100%)' :
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  toastEl.style.cssText = `
    background: ${backgroundColor};
    color: white;
    padding: 16px 24px;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    font-weight: 600;
    animation: slideIn 0.3s ease-out;
    font-family: inherit;
    max-width: 300px;
    word-wrap: break-word;
    pointer-events: auto !important;
  `;

  toastEl.textContent = message;
  container.appendChild(toastEl);

  setTimeout(() => {
    toastEl.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toastEl.remove(), 300);
  }, duration);
}

export default function Toast() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      #toast-container {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        display: flex !important;
        flex-direction: column-reverse !important;
        gap: 10px !important;
        pointer-events: none !important;
        z-index: 999999 !important;
        max-width: 350px !important;
        overflow: visible !important;
      }

      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return <div id="toast-container" style={{ position: 'fixed', bottom: '20px', right: '20px', pointerEvents: 'none', zIndex: 999999 }} />;
}
