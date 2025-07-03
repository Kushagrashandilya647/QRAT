import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    API.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
    // Fetch attendance trend data (mock or real endpoint)
    API.get('/dashboard/trends').then(res => setTrendData(res.data)).catch(() => setTrendData(null));
    API.get('/users/leaderboard').then(res => setLeaderboard(res.data)).catch(() => {});
  }, []);

  return (
    <div className="container py-5 admin-bg position-relative min-vh-100">
      <div className="d-flex align-items-center mb-4 fade-in" style={{animationDelay: '0.05s'}}>
        <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`} alt="avatar" className="rounded-circle me-3" style={{width: 56, height: 56, objectFit: 'cover', border: '2px solid #ffb86b'}} />
        <div>
          <div className="fw-bold fs-4 text-gradient-unique">{getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!</div>
          <div className="text-white-50">Welcome to your dashboard.</div>
        </div>
      </div>
      <h2 className="fw-bold mb-4 text-gradient-unique">Admin Dashboard</h2>
      {user?.role === 'admin' || user?.role === 'super-admin' ? (
        <div className="mb-3 text-end">
          <Link to="/admin/audit-logs" className="btn btn-outline-warning btn-sm">
            <i className="bi bi-clipboard-data me-1"></i> Audit Logs
          </Link>
        </div>
      ) : null}
      {loading ? <div className="text-center py-5"><span className="spinner-border" /></div> : stats && (
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="glass-card-dashboard card shadow text-center p-3 fade-in">
              <div className="fw-bold text-secondary"><i className="bi bi-people me-2 dashboard-icon" data-bs-toggle="tooltip" title="Total Students"></i>Students <span className="badge bg-warning ms-1">{stats.totalStudents}</span></div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="glass-card-dashboard card shadow text-center p-3 fade-in" style={{animationDelay: '0.1s'}}>
              <div className="fw-bold text-secondary"><i className="bi bi-calendar-event me-2 dashboard-icon" data-bs-toggle="tooltip" title="Total Sessions"></i>Sessions <span className="badge bg-info ms-1">{stats.totalSessions}</span></div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="glass-card-dashboard card shadow text-center p-3 fade-in" style={{animationDelay: '0.2s'}}>
              <div className="fw-bold text-secondary"><i className="bi bi-clipboard-check me-2 dashboard-icon" data-bs-toggle="tooltip" title="Total Attendance"></i>Attendance <span className="badge bg-success ms-1">{stats.totalAttendance}</span></div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="glass-card-dashboard card shadow text-center p-3 fade-in" style={{animationDelay: '0.3s'}}>
              <div className="fw-bold text-secondary"><i className="bi bi-bar-chart-line me-2 dashboard-icon" data-bs-toggle="tooltip" title="Attendance %"></i>Attendance % <span className="badge bg-danger ms-1">{stats.attendancePercent}%</span></div>
            </div>
          </div>
        </div>
      )}
      <div className="glass-card-dashboard card shadow p-4 mt-4 fade-in" style={{animationDelay: '0.4s'}}>
        <h5 className="fw-bold mb-3"><i className="bi bi-graph-up me-2 dashboard-icon" data-bs-toggle="tooltip" title="Attendance Trends"></i>Attendance Trends</h5>
        {trendData && trendData.labels && trendData.labels.length ? (
          <Line
            data={{
              labels: trendData.labels,
              datasets: [
                {
                  label: 'Attendance',
                  data: trendData.values,
                  fill: true,
                  backgroundColor: 'rgba(255,184,107,0.15)',
                  borderColor: '#ffb86b',
                  tension: 0.4,
                  pointBackgroundColor: '#ffb86b',
                  pointBorderColor: '#fff',
                  pointRadius: 5,
                  pointHoverRadius: 8,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
              },
              animation: {
                duration: 1200,
                easing: 'easeInOutQuart',
              },
              scales: {
                x: { grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { color: '#fff' } },
                y: { grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { color: '#fff' } },
              },
            }}
            height={120}
          />
        ) : (
          <div className="text-center text-secondary">(No trend data yet)</div>
        )}
      </div>
      <div className="glass-card-dashboard card shadow p-4 mt-4 fade-in" style={{animationDelay: '0.5s'}}>
        <h5 className="fw-bold mb-3"><i className="bi bi-trophy me-2 text-warning"></i>Leaderboard</h5>
        {leaderboard.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-sm table-borderless align-middle mb-0">
              <thead>
                <tr><th>Rank</th><th>Student</th><th>Streak</th></tr>
              </thead>
              <tbody>
                {leaderboard.map((u, i) => (
                  <tr key={u._id}>
                    <td className="fw-bold">#{i+1}</td>
                    <td className="d-flex align-items-center gap-2">
                      <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} alt="avatar" className="rounded-circle" style={{width:32, height:32, objectFit:'cover'}} />
                      {u.name}
                    </td>
                    <td><span className="badge bg-warning text-dark"><i className="bi bi-fire"></i> {u.streak}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="text-secondary">No leaderboard data yet.</div>}
      </div>
      <style>{`
        .admin-bg {
          background: linear-gradient(135deg, #23243a 0%, #6d28d9 50%, #13adc7 100%);
          min-height: 100vh;
        }
        .glass-card-dashboard {
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
        .fade-in[style*='animation-delay'] {
          animation-delay: inherit;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
        .dashboard-icon {
          transition: transform 0.2s, color 0.2s;
          cursor: pointer;
        }
        .dashboard-icon:hover {
          transform: scale(1.2) rotate(-8deg);
          color: #ffb86b !important;
        }
        .text-gradient-unique {
          background: linear-gradient(90deg, #ffb86b, #50fa7b, #8be9fd, #ff79c6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard; 