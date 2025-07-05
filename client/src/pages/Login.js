import React, { useState, useEffect } from 'react';
import API from '../services/api';

function Login({ setUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [sessionTimeout, setSessionTimeout] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Session timeout logic
  useEffect(() => {
    let timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setSessionTimeout(true), 15 * 60 * 1000); // 15 min
    };
    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);
    resetTimeout();
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (isRegister) {
      try {
        await API.post('/auth/register', { name, email, password, role });
        setMessage('Registration successful! Please log in.');
        setIsRegister(false);
      } catch (err) {
        setMessage('Registration failed: ' + (err.response?.data?.message || 'Error'));
      }
    } else {
      try {
        const res = await API.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
      } catch (err) {
        setMessage('Login failed');
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google'; // Backend endpoint for Google OAuth
  };

  const handle2FASubmit = async () => {
    // Call backend to verify 2FA code
    // await API.post('/auth/2fa', { code: twoFACode });
    setShow2FAModal(false);
    setUser({ ...user, twoFAVerified: true });
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

  return (    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 w-100 bg-light">
      <div className="bg-white shadow rounded-4 p-4 w-100" style={{maxWidth: 400}}>
        <h2 className="h3 fw-bold text-primary mb-2 text-center">
          {isRegister ? 'Create Account' : 'Welcome Back!'}
        </h2>
        <p className="mb-4 text-secondary text-center">
          {isRegister ? 'Register to use the system' : 'Sign in to mark your attendance'}
        </p>
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
              onChange={e => {
                setPassword(e.target.value);
                const strength = checkPasswordStrength(e.target.value);
                setPasswordStrength(strength);
              }}
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
                <div className={`progress-bar bg-${passwordStrength.color}`} style={{width: passwordStrength.level === 'weak' ? '33%' : passwordStrength.level === 'medium' ? '66%' : '100%'}}></div>
              </div>
              <small className={`text-${passwordStrength.color}`}>{passwordStrength.level}</small>
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 login-btn-anim"
            disabled={isRegister && passwordStrength.level === 'weak'}
          >
            <i className={`bi ${isRegister ? 'bi-person-plus' : 'bi-box-arrow-in-right'}`}></i>
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <button className="btn btn-outline-danger w-100 mt-2" onClick={handleGoogleLogin}>
          <i className="bi bi-google me-2"></i>Sign in with Google
        </button>
        <div className="mt-3 text-primary text-center" style={{cursor: 'pointer'}} onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </div>
        {message && <div className="mt-3 text-danger text-center">{message}</div>}
        {show2FAModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{background: 'rgba(0,0,0,0.4)'}}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Two-Factor Authentication</h5>
                  <button type="button" className="btn-close" onClick={() => setShow2FAModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input className="form-control" placeholder="Enter 2FA code" value={twoFACode} onChange={e => setTwoFACode(e.target.value)} />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={handle2FASubmit} disabled={!twoFACode}>Verify</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {sessionTimeout && (
          <div className="modal fade show d-block" tabIndex="-1" style={{background: 'rgba(0,0,0,0.4)'}}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Session Timeout</h5>
                </div>
                <div className="modal-body">
                  <p>Your session has expired due to inactivity. Please log in again.</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={() => { setSessionTimeout(false); setUser(null); localStorage.removeItem('token'); }}>OK</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login; 