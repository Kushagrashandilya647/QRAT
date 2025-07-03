import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useToaster } from '../components/Toaster';

function UserManagement() {
  const { showToast } = useToaster();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    API.get('/users/users')
      .then(res => setUsers(res.data))
      .catch(() => showToast('Failed to load users', 'danger'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleExport = async (type) => {
    try {
      const res = await API.get(`/users/export?type=${type}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      showToast('Export failed', 'danger');
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await API.post('/users/import', formData);
      showToast('Import successful!', 'success');
      window.location.reload();
    } catch {
      showToast('Import failed', 'danger');
    } finally {
      setImporting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      setUsers(users => users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      showToast('Role updated!', 'success');
    } catch {
      showToast('Failed to update role', 'danger');
    }
  };

  const filtered = users.filter(u => (roleFilter ? u.role === roleFilter : true) && (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-primary mb-4">User Management</h2>
      <div className="card shadow p-4 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-md-4">
            <input className="form-control" placeholder="Search by name or email" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="super-admin">Super Admin</option>
            </select>
          </div>
          <div className="col-md-5 d-flex gap-2">
            <button className="btn btn-outline-success" onClick={() => handleExport('csv')}>Export CSV</button>
            <button className="btn btn-outline-info" onClick={() => handleExport('xlsx')}>Export Excel</button>
            <label className="btn btn-outline-primary mb-0">
              Import CSV
              <input type="file" accept=".csv" onChange={handleImport} style={{display:'none'}} disabled={importing} />
            </label>
          </div>
        </div>
      </div>
      <div className="card shadow p-4">
        <h5 className="fw-bold mb-3">Users</h5>
        {loading ? <div className="text-center py-5"><span className="spinner-border" /></div> : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select className="form-select form-select-sm w-auto d-inline" value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)}>
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                        <option value="super-admin">Super Admin</option>
                      </select>
                    </td>
                    <td>
                      {/* User attendance modal can be added here */}
                      <span className="text-secondary ms-2">(View attendance)</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement; 