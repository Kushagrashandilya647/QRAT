import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold text-primary"><i className="bi bi-qr-code me-2"></i>QR Attendance</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/scan" className="nav-link text-primary"><i className="bi bi-qr-code-scan me-1"></i>Scan</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin" className="nav-link text-primary"><i className="bi bi-person-gear me-1"></i>Admin</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header; 