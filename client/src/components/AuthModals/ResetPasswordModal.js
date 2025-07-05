import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToaster } from '../../components/Toaster';
import API from '../../services/api';

function ResetPasswordModal({ show, onHide, onShowLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { showToast } = useToaster();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      await API.post('/auth/forgot-password', { email });
      setMessage('Password reset email sent! Please check your inbox.');
      showToast('Password reset email sent!', 'success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      setMessage(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{background: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <div className="text-center mb-4">
            <i className="bi bi-lock text-primary display-4 mb-3"></i>
            <h5 className="fw-bold text-primary">Reset Password</h5>
            <p className="text-muted">Enter your email to receive a password reset link</p>
          </div>
          
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope"></i></span>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-100 fw-semibold" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Sending...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  Send Reset Link
                </>
              )}
            </button>
          </form>
          
          {message && (
            <div className={`alert ${message.includes('sent') ? 'alert-success' : 'alert-danger'} mt-3`}>
              {message}
            </div>
          )}
          
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-link p-0" onClick={onShowLogin}>
              Back to Login
            </button>
            <button className="btn btn-secondary" onClick={onHide}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordModal; 