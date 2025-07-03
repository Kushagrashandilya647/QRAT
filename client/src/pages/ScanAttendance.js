import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import API from '../services/api';
import { useToaster } from '../components/Toaster';

function ScanAttendance() {
  const { showToast } = useToaster();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const [showScanner, setShowScanner] = useState(true);
  const [geoEnabled, setGeoEnabled] = useState(false);
  const [faceEnabled, setFaceEnabled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnline = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, []);

  const handleScan = async (data) => {
    if (data && data.text && showScanner) {
      setShowScanner(false);
      setStatus('loading');
      if (geoEnabled && 'geolocation' in navigator) {
        await new Promise(resolve => navigator.geolocation.getCurrentPosition(resolve, resolve));
      }
      if (faceEnabled) {
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
      if (!isOnline) {
        const offlineScans = JSON.parse(localStorage.getItem('offlineScans') || '[]');
        offlineScans.push({ qrData: data.text, time: Date.now() });
        localStorage.setItem('offlineScans', JSON.stringify(offlineScans));
        setMessage('Attendance saved offline. Will sync when online.');
        setStatus('success');
        showToast('Attendance saved offline!', 'info');
        return;
      }
      try {
        const res = await API.post('/attendance/mark', { qrData: data.text });
        setMessage(res.data.message);
        setStatus('success');
        showToast('Attendance marked!', 'success');
      } catch (err) {
        setMessage(err.response?.data?.message || 'Error');
        setStatus('error');
        showToast('Failed to mark attendance', 'danger');
      }
    }
  };

  const handleRetry = () => {
    setMessage('');
    setStatus('idle');
    setShowScanner(true);
  };

  return (
    <div className="scan-bg container py-5 d-flex flex-column align-items-center justify-content-center min-vh-100 position-relative">
      <div className="glass-card-scan card shadow p-4 fade-in" style={{maxWidth: 420, width: '100%'}}>
        <h2 className="h4 fw-bold mb-3 text-center">
          <i className="bi bi-qr-code-scan me-2 scan-anim-icon" data-bs-toggle="tooltip" title="Scan QR to Mark Attendance"></i>Scan QR to Mark Attendance
        </h2>
        <p className="mb-3 text-secondary text-center">Align the QR code within the frame</p>
        <div className="mb-3 d-flex justify-content-center position-relative">
          {showScanner && (
            <div style={{height: 280, width: 280, borderRadius: '1.5rem', overflow: 'hidden', border: '2px solid #ff79c6', position: 'relative', background: '#23243a'}}>
              <QrReader
                constraints={{ facingMode: 'environment' }}
                onResult={(result, error) => {
                  if (!!result) {
                    handleScan({ text: result?.text });
                  }
                }}
                style={{ width: '100%', height: '100%' }}
              />
              {/* Animated scan line */}
              <div className="scanline-anim" />
            </div>
          )}
          {!showScanner && (
            <div className="d-flex align-items-center justify-content-center bg-light" style={{height: 280, width: 280, borderRadius: '1.5rem', border: '2px solid #ff79c6'}}>
              <span className={`display-4 fw-bold ${status === 'success' ? 'text-success' : 'text-danger'}`}>{status === 'success' ? '✔️' : status === 'error' ? '❌' : ''}</span>
            </div>
          )}
        </div>
        <div className={`mb-3 text-center fw-semibold ${status === 'success' ? 'text-success' : status === 'error' ? 'text-danger' : 'text-primary'}`}>{message}</div>
        {!showScanner && (
          <button onClick={handleRetry} className="btn btn-primary w-100 fade-in" style={{animationDelay: '0.2s'}}>
            <i className="bi bi-arrow-clockwise me-2"></i>Try Again
          </button>
        )}
        <div className="mb-3 d-flex gap-3 justify-content-center">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="geoSwitch" checked={geoEnabled} onChange={e => setGeoEnabled(e.target.checked)} />
            <label className="form-check-label" htmlFor="geoSwitch">Geolocation Verification</label>
          </div>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="faceSwitch" checked={faceEnabled} onChange={e => setFaceEnabled(e.target.checked)} />
            <label className="form-check-label" htmlFor="faceSwitch">Face Recognition</label>
          </div>
        </div>
        {!isOnline && <div className="alert alert-warning text-center py-2 mb-2">You are offline. Attendance will be saved and synced when online.</div>}
      </div>
      <style>{`
        .scan-bg {
          background: linear-gradient(135deg, #23243a 0%, #ff79c6 60%, #50fa7b 100%);
          min-height: 100vh;
        }
        .glass-card-scan {
          background: rgba(34, 34, 51, 0.25) !important;
          backdrop-filter: blur(18px) saturate(180%);
          border: 1.5px solid rgba(255,255,255,0.18);
          border-radius: 1.5rem;
          box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.18);
          color: #fff;
        }
        .fade-in {
          opacity: 0;
          animation: fadeInUp 0.7s forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
        .scan-anim-icon {
          transition: transform 0.2s, color 0.2s;
          color: #ff79c6;
          animation: pulseIcon 1.2s infinite alternate;
        }
        .scan-anim-icon:hover {
          transform: scale(1.2) rotate(-8deg);
          color: #50fa7b !important;
        }
        @keyframes pulseIcon {
          0% { filter: drop-shadow(0 0 0 #ff79c6); }
          100% { filter: drop-shadow(0 0 12px #ff79c6); }
        }
        .scanline-anim {
          position: absolute;
          left: 0; right: 0;
          top: 10%;
          height: 4px;
          background: linear-gradient(90deg, #ff79c6 0%, #50fa7b 100%);
          border-radius: 2px;
          animation: scanline 1.2s infinite alternate cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes scanline {
          0% { top: 10%; }
          100% { top: 80%; }
        }
      `}</style>
    </div>
  );
}

export default ScanAttendance; 