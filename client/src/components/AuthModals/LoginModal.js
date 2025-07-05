import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToaster } from '../Toaster';
import API from '../../services/api';

function LoginModal({ show, onHide, onShowRegister, onShowReset }) {
  const { login } = useAuth();
  const { showToast } = useToaster();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ level: 'weak', color: 'danger' });
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      if (isRegister) {
        await API.post('/auth/register', { name, email, password, role });
        setMessage('Registration successful! Please check your email to verify your account.');
        showToast('Registration successful! Please verify your email.', 'success');
        setIsRegister(false);
      } else {
        await login(email, password);
        showToast('Login successful', 'success');
        onHide();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Operation failed';
      setMessage(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implementation of Google login
    showToast('Google login coming soon!', 'info');
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength < 3) return { level: 'weak', color: 'danger' };
    if (strength < 5) return { level: 'medium', color: 'warning' };
    return { level: 'strong', color: 'success' };
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const strength = checkPasswordStrength(newPassword);
    setPasswordStrength(strength);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setRole('student');
    setMessage('');
    setPasswordStrength({ level: 'weak', color: 'danger' });
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    resetForm();
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{background: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <div className="text-center mb-4">
            <i className={`bi ${isRegister ? 'bi-person-plus' : 'bi-box-arrow-in-right'} text-primary display-4 mb-3`}></i>
            <h5 className="fw-bold text-primary">{isRegister ? 'Create Account' : 'Welcome Back!'}</h5>
            <p className="text-muted">{isRegister ? 'Register to use the system' : 'Sign in to mark your attendance'}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="w-100 d-flex flex-column gap-3">
            {isRegister && (
              <>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-person"></i></span>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Name"
                    required
                    className="form-control"
                  />
                </div>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="form-select"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </>
            )}
            
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope"></i></span>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                required
                className="form-control"
              />
            </div>
            
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock"></i></span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                required
                className="form-control"
              />
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
            
            {password && (
              <div className="d-flex align-items-center gap-2">
                <div className="progress flex-grow-1" style={{height: '4px'}}>
                  <div className={`progress-bar bg-${passwordStrength.color}`} 
                       style={{width: passwordStrength.level === 'weak' ? '33%' : passwordStrength.level === 'medium' ? '66%' : '100%'}}>
                  </div>
                </div>
                <small className={`text-${passwordStrength.color}`}>{passwordStrength.level}</small>
              </div>
            )}
            
            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 login-btn-anim"
              disabled={loading || (isRegister && passwordStrength.level === 'weak')}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  {isRegister ? 'Registering...' : 'Logging in...'}
                </>
              ) : (
                <>
                  <i className={`bi ${isRegister ? 'bi-person-plus' : 'bi-box-arrow-in-right'}`}></i>
                  {isRegister ? 'Register' : 'Login'}
                </>
              )}
            </button>
          </form>
          
          <button className="btn btn-outline-danger w-100 mt-2" onClick={handleGoogleLogin}>
            <i className="bi bi-google me-2"></i>Sign in with Google
          </button>
          
          <div className="mt-3 text-primary text-center" style={{cursor: 'pointer'}} onClick={toggleMode}>
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </div>
          
          {!isRegister && (
            <div className="mt-2 text-center">
              <button 
                type="button" 
                className="btn btn-link text-decoration-none p-0"
                onClick={() => onShowReset()}
              >
                Forgot Password?
              </button>
            </div>
          )}
          
          {message && (
            <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} mt-3`}>
              {message}
            </div>
          )}
          
          <button className="btn btn-secondary w-100 mt-3" onClick={onHide}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal; 