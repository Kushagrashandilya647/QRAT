import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function useToaster() {
  return useContext(ToastContext);
}

export function ToasterProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(ts => [...ts, { id, message, type }]);
    setTimeout(() => {
      setToasts(ts => ts.filter(t => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast show align-items-center text-bg-${t.type} border-0 mb-2`}>
            <div className="d-flex">
              <div className="toast-body">{t.message}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))}></button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
} 