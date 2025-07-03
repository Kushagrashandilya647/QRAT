import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useToaster } from '../components/Toaster';

function SessionManagement() {
  const { showToast } = useToaster();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [className, setClassName] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    API.get('/session')
      .then(res => setSessions(res.data))
      .catch(() => showToast('Failed to load sessions', 'danger'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/session', { title, class: className, validFrom, validTo });
      setSessions([res.data, ...sessions]);
      setTitle(''); setClassName(''); setValidFrom(''); setValidTo('');
      showToast('Session created!', 'success');
    } catch {
      showToast('Create failed', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this session?')) return;
    try {
      await API.delete(`/session/${id}`);
      setSessions(sessions.filter(s => s._id !== id));
      showToast('Session deleted', 'success');
    } catch {
      showToast('Delete failed', 'danger');
    }
  };

  const handleExport = async (type) => {
    try {
      const res = await API.get(`/session/export?type=${type}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sessions.${type}`);
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
      await API.post('/session/import', formData);
      showToast('Import successful!', 'success');
      window.location.reload();
    } catch {
      showToast('Import failed', 'danger');
    } finally {
      setImporting(false);
    }
  };

  const filtered = sessions.filter(s =>
    (classFilter ? s.class?.toLowerCase().includes(classFilter.toLowerCase()) : true) &&
    (statusFilter ? s.status === statusFilter : true) &&
    (dateFilter ? (s.validFrom && new Date(s.validFrom).toISOString().slice(0,10) === dateFilter) : true)
  );

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-primary mb-4">Session Management</h2>
      <div className="card shadow p-4 mb-4">
        <form onSubmit={handleCreate} className="row g-3 align-items-end mb-3">
          <div className="col-md-3"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="form-control" required /></div>
          <div className="col-md-3"><input value={className} onChange={e => setClassName(e.target.value)} placeholder="Class" className="form-control" required /></div>
          <div className="col-md-2"><input type="datetime-local" value={validFrom} onChange={e => setValidFrom(e.target.value)} className="form-control" required /></div>
          <div className="col-md-2"><input type="datetime-local" value={validTo} onChange={e => setValidTo(e.target.value)} className="form-control" required /></div>
          <div className="col-md-2"><button type="submit" className="btn btn-primary w-100">Create</button></div>
        </form>
      </div>
      <div className="card shadow p-4">
        <h5 className="fw-bold mb-3">Sessions</h5>
        {loading ? <div className="text-center py-5"><span className="spinner-border" /></div> : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Title</th>
                  <th>Class</th>
                  <th>Valid From</th>
                  <th>Valid To</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s._id}>
                    <td>{s.title}</td>
                    <td>{s.class}</td>
                    <td>{s.validFrom ? new Date(s.validFrom).toLocaleString() : ''}</td>
                    <td>{s.validTo ? new Date(s.validTo).toLocaleString() : ''}</td>
                    <td>{s.status}</td>
                    <td>
                      {/* Edit and QR modals can be added here */}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Delete</button>
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

export default SessionManagement; 