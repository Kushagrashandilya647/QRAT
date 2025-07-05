import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow border-danger">
                <div className="card-body text-center p-5">
                  <i className="bi bi-exclamation-triangle text-danger display-1 mb-3"></i>
                  <h3 className="text-danger mb-3">Something went wrong</h3>
                  <p className="text-muted mb-4">
                    We're sorry, but something unexpected happened. Please try refreshing the page.
                  </p>
                  <div className="d-flex gap-2 justify-content-center">
                    <button 
                      className="btn btn-primary" 
                      onClick={() => window.location.reload()}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>Refresh Page
                    </button>
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={() => this.setState({ hasError: false })}
                    >
                      Try Again
                    </button>
                  </div>
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="mt-4 text-start">
                      <summary className="text-muted">Error Details (Development)</summary>
                      <pre className="mt-2 p-3 bg-light rounded small">
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 