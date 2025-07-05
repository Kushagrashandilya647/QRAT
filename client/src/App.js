import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToasterProvider } from './components/Toaster';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginModal from './components/AuthModals/LoginModal';
import RegisterModal from './components/AuthModals/RegisterModal';
import ResetPasswordModal from './components/AuthModals/ResetPasswordModal';
// Import all main pages (to be created/enhanced)
import ProfilePage from './pages/ProfilePage';
import AttendanceHistory from './pages/AttendanceHistory';
import ScanAttendance from './pages/ScanAttendance';
import AdminDashboard from './pages/AdminDashboard';
import SessionManagement from './pages/SessionManagement';
import UserManagement from './pages/UserManagement';
import AuditLogs from './pages/AuditLogs';
import EmailVerification from './pages/EmailVerification';
import ResetPassword from './pages/ResetPassword';
import ErrorBoundary from './components/ErrorBoundary';

function AppContent() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'theme-dark' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleToggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <>
      <Navbar user={user} onLogout={logout} onShowLogin={() => setShowLogin(true)} onToggleTheme={handleToggleTheme} theme={theme} />
      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} onShowRegister={() => { setShowLogin(false); setShowRegister(true); }} onShowReset={() => { setShowLogin(false); setShowReset(true); }} />
      <RegisterModal show={showRegister} onHide={() => setShowRegister(false)} onShowLogin={() => { setShowRegister(false); setShowLogin(true); }} />
      <ResetPasswordModal show={showReset} onHide={() => setShowReset(false)} onShowLogin={() => { setShowReset(false); setShowLogin(true); }} />
      <Routes>
        <Route path="/" element={
          <div className="home-bg min-vh-100 d-flex align-items-center justify-content-center position-relative">
            <div className="glass-card p-5 rounded-4 shadow-lg text-center" style={{maxWidth: 520, width: '100%', backdropFilter: 'blur(24px) saturate(180%)', background: 'rgba(34, 34, 51, 0.25)', border: '1.5px solid rgba(255,255,255,0.18)'}}>
              <div className="mb-4">
                <i className="bi bi-qr-code display-1 mb-3" style={{color: '#ffb86b'}}></i>
                <h1 className="display-5 fw-bold mb-2 text-gradient-unique">QR Attendance</h1>
                <p className="lead text-white-50 mb-4">A futuristic, secure, and easy-to-use attendance system for students and admins.</p>
              </div>
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                  <div className="feature-card p-3 rounded-3 h-100 d-flex flex-column align-items-center" style={{background: 'rgba(255, 184, 107, 0.18)'}}>
                    <i className="bi bi-qr-code-scan fs-2 mb-2" style={{color: '#50fa7b'}}></i>
                    <div className="fw-semibold text-white">QR Scan Attendance</div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="feature-card p-3 rounded-3 h-100 d-flex flex-column align-items-center" style={{background: 'rgba(80, 250, 123, 0.18)'}}>
                    <i className="bi bi-bar-chart-line fs-2 mb-2" style={{color: '#8be9fd'}}></i>
                    <div className="fw-semibold text-white">Live Dashboard</div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="feature-card p-3 rounded-3 h-100 d-flex flex-column align-items-center" style={{background: 'rgba(139, 233, 253, 0.18)'}}>
                    <i className="bi bi-person-check fs-2 mb-2" style={{color: '#ff79c6'}}></i>
                    <div className="fw-semibold text-white">Profile & History</div>
                  </div>
                </div>
              </div>
              <button className="btn btn-lg fw-bold shadow get-started-btn" onClick={() => setShowLogin(true)}>
                <i className="bi bi-box-arrow-in-right me-2"></i>Get Started
              </button>
            </div>
            <style>{`
              .home-bg {
                background: linear-gradient(135deg, #23243a 0%, #6d28d9 50%, #13adc7 100%);
                overflow: hidden;
              }
              .glass-card {
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                border-radius: 2rem;
                border: 1.5px solid rgba(255,255,255,0.18);
              }
              .text-gradient-unique {
                background: linear-gradient(90deg, #ffb86b, #50fa7b, #8be9fd, #ff79c6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-fill-color: transparent;
              }
              .feature-card {
                transition: transform 0.2s, box-shadow 0.2s;
                border: 1.5px solid rgba(255,255,255,0.12);
                box-shadow: 0 2px 12px 0 rgba(80, 80, 200, 0.10);
              }
              .feature-card:hover {
                transform: translateY(-6px) scale(1.04);
                box-shadow: 0 4px 24px 0 rgba(255, 184, 107, 0.18);
                background: rgba(255,255,255,0.28) !important;
              }
              .get-started-btn {
                background: linear-gradient(90deg, #ffb86b, #ff79c6);
                color: #23243a;
                border: none;
                padding-left: 2.5rem;
                padding-right: 2.5rem;
              }
              .get-started-btn:hover {
                background: linear-gradient(90deg, #ff79c6, #ffb86b);
                color: #23243a;
              }
              body.theme-dark {
                background: #181a20 !important;
                color: #f1f1f1 !important;
              }
              body.theme-dark .glass-card, body.theme-dark .glass-card-dashboard, body.theme-dark .glass-card-scan, body.theme-dark .glass-card-login {
                background: rgba(24, 26, 32, 0.7) !important;
                color: #f1f1f1 !important;
                border-color: rgba(255,255,255,0.08) !important;
              }
              body.theme-dark .card, body.theme-dark .modal-content {
                background: #23243a !important;
                color: #f1f1f1 !important;
              }
              body.theme-dark .btn-primary, body.theme-dark .get-started-btn, body.theme-dark .login-btn-anim {
                background: linear-gradient(90deg, #8be9fd, #ff79c6) !important;
                color: #23243a !important;
                border: none !important;
              }
              body.theme-dark .feature-card {
                background: rgba(139, 233, 253, 0.18) !important;
                color: #fff !important;
              }
              body.theme-dark .navbar, body.theme-dark .navbar-light {
                background: #23243a !important;
                color: #fff !important;
              }
            `}</style>
          </div>
        } />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><AttendanceHistory /></ProtectedRoute>} />
        <Route path="/scan" element={<ProtectedRoute role="student"><ScanAttendance /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/sessions" element={<ProtectedRoute role="admin"><SessionManagement /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/audit-logs" element={<ProtectedRoute role="admin"><AuditLogs /></ProtectedRoute>} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Fallback */}
        <Route path="*" element={<div className="container py-5 text-center"><h2>Page Not Found</h2></div>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToasterProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ToasterProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 