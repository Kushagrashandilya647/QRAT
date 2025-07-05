import React from 'react';

function LoadingSpinner({ size = 'md', type = 'spinner', text = 'Loading...', className = '' }) {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'spinner-border-sm';
      case 'lg': return 'spinner-border-lg';
      default: return 'spinner-border';
    }
  };

  const getSpinnerContent = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="d-flex justify-content-center">
            <div className="spinner-grow spinner-grow-sm me-1" role="status"></div>
            <div className="spinner-grow spinner-grow-sm me-1" role="status" style={{animationDelay: '0.1s'}}></div>
            <div className="spinner-grow spinner-grow-sm" role="status" style={{animationDelay: '0.2s'}}></div>
          </div>
        );
      case 'skeleton':
        return (
          <div className="skeleton-loader">
            <div className="skeleton-item"></div>
            <div className="skeleton-item"></div>
            <div className="skeleton-item"></div>
          </div>
        );
      default:
        return <div className={getSizeClass()} role="status"></div>;
    }
  };

  return (
    <div className={`text-center py-4 ${className}`}>
      {getSpinnerContent()}
      {text && <div className="mt-2 text-muted">{text}</div>}
      <style>{`
        .skeleton-loader {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center;
        }
        .skeleton-item {
          width: 100px;
          height: 12px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner; 