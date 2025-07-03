import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToaster } from '../Toaster';

function LoginModal({ show, onHide, onShowRegister, onShowReset }) {
  const { login } = useAuth();
  const { showToast } = useToaster();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast('Login successful', 'success');
      onHide();
    } catch (err) {
      showToast('Login failed: ' + (err.response?.data?.message || 'Error'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal fade${show ? ' show d-block' : ''}`} tabIndex="-1" style={{background: show ? 'rgba(0,0,0,0.4)' : 'none'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <h5 className="mb-3 fw-bold text-primary text-center">Login</h5>
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? <span className="spinner-border spinner-border-sm" /> : 'Login'}</button>
          </form>
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-link p-0" onClick={onShowRegister}>Register</button>
            <button className="btn btn-link p-0" onClick={onShowReset}>Forgot Password?</button>
          </div>
          <button className="btn btn-secondary w-100 mt-3" onClick={onHide}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal; 