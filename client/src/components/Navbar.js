import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout, onShowLogin, onToggleTheme, theme }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold text-primary"><i className="bi bi-qr-code me-2"></i>QR Attendance</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {user && user.role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link"><i className="bi bi-speedometer2 me-1"></i>Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/sessions" className="nav-link"><i className="bi bi-calendar-event me-1"></i>Sessions</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/users" className="nav-link"><i className="bi bi-people me-1"></i>Users</Link>
                </li>
              </>
            )}
            {user && user.role === 'student' && (
              <>
                <li className="nav-item">
                  <Link to="/scan" className="nav-link"><i className="bi bi-qr-code-scan me-1"></i>Scan</Link>
                </li>
                <li className="nav-item">
                  <Link to="/history" className="nav-link"><i className="bi bi-clock-history me-1"></i>History</Link>
                </li>
              </>
            )}
            {user ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt="avatar" className="rounded-circle me-2" style={{width: 32, height: 32, objectFit: 'cover'}} />
                  {user.name}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person-circle me-2"></i>Profile</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={onLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <button className="btn btn-outline-primary ms-2" onClick={onShowLogin}><i className="bi bi-box-arrow-in-right me-1"></i>Login</button>
              </li>
            )}
            <li className="nav-item d-flex align-items-center ms-2">
              <button className="btn btn-outline-secondary border-0" onClick={onToggleTheme} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'} fs-5`}></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 