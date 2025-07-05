import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function useToaster() {
  return useContext(ToastContext);
}

export function ToasterProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    setToasts(ts => [...ts, newToast]);
    
    setTimeout(() => {
      setToasts(ts => ts.filter(t => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(ts => ts.filter(t => t.id !== id));
  }, []);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return 'bi-check-circle';
      case 'error': return 'bi-x-circle';
      case 'warning': return 'bi-exclamation-triangle';
      case 'info': return 'bi-info-circle';
      default: return 'bi-info-circle';
    }
  };

  const getToastClass = (type) => {
    switch (type) {
      case 'success': return 'bg-success text-white';
      case 'error': return 'bg-danger text-white';
      case 'warning': return 'bg-warning text-dark';
      case 'info': return 'bg-info text-white';
      default: return 'bg-info text-white';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`toast show align-items-center border-0 mb-2 ${getToastClass(toast.type)}`}
            style={{ minWidth: '300px' }}
          >
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center">
                <i className={`bi ${getToastIcon(toast.type)} me-2 fs-5`}></i>
                {toast.message}
              </div>
              <button 
                type="button" 
                className="btn-close btn-close-white me-2 m-auto" 
                onClick={() => dismissToast(toast.id)}
                aria-label="Close"
              ></button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
} 