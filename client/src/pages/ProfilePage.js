import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { useToaster } from '../components/Toaster';

function ProfilePage() {
  const { user, setUser } = useAuth();
  const { showToast } = useToaster();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put('/users/profile', { name, avatar });
      setUser(res.data);
      showToast('Profile updated!', 'success');
    } catch (err) {
      showToast('Update failed: ' + (err.response?.data?.message || 'Error'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    API.get('/users/streak').then(res => setStreak(res.data.streak)).catch(() => {});
    API.get('/users/badges').then(res => setBadges(res.data.badges)).catch(() => {});
  }, []);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h3 className="fw-bold text-primary mb-3">Profile</h3>
            <form onSubmit={handleUpdate} className="d-flex flex-column gap-3">
              <div className="text-center">
                <img src={avatar || `https://ui-avatars.com/api/?name=${name}`} alt="avatar" className="rounded-circle mb-2" style={{width: 80, height: 80, objectFit: 'cover'}} />
                <div className="mt-2">
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="form-control" />
                </div>
              </div>
              <input type="text" className="form-control" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
              <input type="url" className="form-control" placeholder="Avatar URL (optional)" value={avatar} onChange={e => setAvatar(e.target.value)} />
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? <span className="spinner-border spinner-border-sm" /> : 'Update Profile'}</button>
            </form>
          </div>
          <div className="card shadow p-4 mb-4 d-flex flex-row align-items-center gap-3">
            <i className="bi bi-fire fs-1 text-warning"></i>
            <div>
              <div className="fw-bold fs-5">Attendance Streak</div>
              <div className="fs-4 text-gradient-unique">{streak} days</div>
            </div>
          </div>
          {badges.length > 0 && (
            <div className="card shadow p-4 mb-4">
              <div className="fw-bold mb-2">Badges</div>
              <div className="d-flex flex-wrap gap-3">
                {badges.map(badge => (
                  <div key={badge.id} className="badge bg-info text-dark p-2 px-3 rounded-pill d-flex align-items-center gap-2">
                    <i className={`bi ${badge.icon} fs-5`}></i> {badge.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage; 