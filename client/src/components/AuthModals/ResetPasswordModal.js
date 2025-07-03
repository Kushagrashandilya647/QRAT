import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToaster } from '../Toaster';

function ResetPasswordModal({ show, onHide, onShowLogin }) {
  const { requestPasswordReset, resetPassword } = useAuth();
  const { showToast } = useToaster();
  const [step, setStep] = useState(1); // 1: request, 2: reset
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await requestPasswordReset(email);
      showToast('Reset token sent! (Check email or use token below)', 'success');
      setToken(res.data.token); // For demo, show token
      setStep(2);
    } catch (err) {
      showToast('Reset failed: ' + (err.response?.data?.message || 'Error'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(token, password);
      showToast('Password updated! Please login.', 'success');
      onShowLogin();
    } catch (err) {
      showToast('Reset failed: ' + (err.response?.data?.message || 'Error'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal fade${show ? ' show d-block' : ''}`} tabIndex="-1" style={{background: show ? 'rgba(0,0,0,0.4)' : 'none'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <h5 className="mb-3 fw-bold text-primary text-center">Reset Password</h5>
          {step === 1 ? (
            <form onSubmit={handleRequest} className="d-flex flex-column gap-3">
              <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? <span className="spinner-border spinner-border-sm" /> : 'Send Reset Token'}</button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="d-flex flex-column gap-3">
              <input type="text" className="form-control" placeholder="Token" value={token} onChange={e => setToken(e.target.value)} required />
              <input type="password" className="form-control" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? <span className="spinner-border spinner-border-sm" /> : 'Reset Password'}</button>
            </form>
          )}
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-link p-0" onClick={onShowLogin}>Back to Login</button>
          </div>
          <button className="btn btn-secondary w-100 mt-3" onClick={onHide}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordModal; 