import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToaster } from '../Toaster';

function RegisterModal({ show, onHide, onShowLogin }) {
  const { register } = useAuth();
  const { showToast } = useToaster();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password, role);
      showToast('Registration successful! Please login.', 'success');
      onShowLogin();
    } catch (err) {
      showToast('Registration failed: ' + (err.response?.data?.message || 'Error'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal fade${show ? ' show d-block' : ''}`} tabIndex="-1" style={{background: show ? 'rgba(0,0,0,0.4)' : 'none'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <h5 className="mb-3 fw-bold text-primary text-center">Register</h5>
          <form onSubmit={handleRegister} className="d-flex flex-column gap-3">
            <input type="text" className="form-control" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? <span className="spinner-border spinner-border-sm" /> : 'Register'}</button>
          </form>
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-link p-0" onClick={onShowLogin}>Already have an account? Login</button>
          </div>
          <button className="btn btn-secondary w-100 mt-3" onClick={onHide}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal; 