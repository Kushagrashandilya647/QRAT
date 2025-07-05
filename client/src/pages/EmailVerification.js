import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useToaster } from '../components/Toaster';
import LoadingSpinner from '../components/LoadingSpinner';

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToaster();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const response = await API.post('/auth/verify-email', { token });
      setStatus('success');
      setMessage('Email verified successfully! You can now log in.');
      showToast('Email verified successfully!', 'success');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Email verification failed');
      showToast('Email verification failed', 'error');
    }
  };

  const resendVerification = async () => {
    try {
      await API.post('/auth/resend-verification');
      showToast('Verification email sent!', 'success');
    } catch (error) {
      showToast('Failed to send verification email', 'error');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="container py-5 d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center">
          <LoadingSpinner text="Verifying your email..." />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-5" style={{ maxWidth: 500 }}>
        <div className="text-center">
          {status === 'success' ? (
            <>
              <i className="bi bi-check-circle text-success display-1 mb-3"></i>
              <h3 className="text-success mb-3">Email Verified!</h3>
            </>
          ) : (
            <>
              <i className="bi bi-x-circle text-danger display-1 mb-3"></i>
              <h3 className="text-danger mb-3">Verification Failed</h3>
            </>
          )}
          
          <p className="mb-4">{message}</p>
          
          <div className="d-flex gap-2 justify-content-center">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/')}
            >
              Go to Login
            </button>
            
            {status === 'error' && (
              <button 
                className="btn btn-outline-secondary" 
                onClick={resendVerification}
              >
                Resend Verification
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification; 