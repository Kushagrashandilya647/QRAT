import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useToaster } from '../components/Toaster';
import LoadingSpinner from '../components/LoadingSpinner';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToaster();
  const [status, setStatus] = useState('loading'); // loading, form, success, error
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setStatus('error');
      return;
    }
    setToken(tokenParam);
    setStatus('form');
  }, [searchParams]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (passwordStrength.level === 'weak') {
      showToast('Password is too weak', 'error');
      return;
    }

    try {
      await API.post('/auth/reset-password', { token, password });
      setStatus('success');
      showToast('Password reset successfully!', 'success');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      showToast(error.response?.data?.message || 'Password reset failed', 'error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="container py-5 d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center">
          <LoadingSpinner text="Loading..." />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container py-5 d-flex align-items-center justify-content-center min-vh-100">
        <div className="card shadow p-5" style={{ maxWidth: 500 }}>
          <div className="text-center">
            <i className="bi bi-x-circle text-danger display-1 mb-3"></i>
            <h3 className="text-danger mb-3">Invalid Reset Link</h3>
            <p className="mb-4">The password reset link is invalid or has expired.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/')}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="container py-5 d-flex align-items-center justify-content-center min-vh-100">
        <div className="card shadow p-5" style={{ maxWidth: 500 }}>
          <div className="text-center">
            <i className="bi bi-check-circle text-success display-1 mb-3"></i>
            <h3 className="text-success mb-3">Password Reset Successfully!</h3>
            <p className="mb-4">Your password has been reset. You can now log in with your new password.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/')}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-5" style={{ maxWidth: 500 }}>
        <div className="text-center mb-4">
          <i className="bi bi-lock text-primary display-1 mb-3"></i>
          <h3 className="mb-3">Reset Your Password</h3>
          <p className="text-muted">Enter your new password below</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                required
              />
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
            {password && (
              <div className="d-flex align-items-center gap-2 mt-2">
                <div className="progress flex-grow-1" style={{height: '4px'}}>
                  <div className={`progress-bar bg-${passwordStrength.color}`} 
                       style={{width: passwordStrength.level === 'weak' ? '33%' : passwordStrength.level === 'medium' ? '66%' : '100%'}}>
                  </div>
                </div>
                <small className={`text-${passwordStrength.color}`}>{passwordStrength.level}</small>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={passwordStrength.level === 'weak' || password !== confirmPassword}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword; 