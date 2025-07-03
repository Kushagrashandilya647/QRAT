import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useToaster } from '../components/Toaster';

function AuditLogs() {
  const { showToast } = useToaster();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/audit-logs')
      .then(res => setLogs(res.data))
      .catch(() => showToast('Failed to load audit logs', 'danger'))
      .finally(() => setLoading(false));
  }, [showToast]);

  return (
    <div className="container py-5">
      <div className="card shadow p-4">
        <h3 className="fw-bold text-warning mb-3"><i className="bi bi-clipboard-data me-2"></i>Audit Logs</h3>
        {loading ? <div className="text-center py-5"><span className="spinner-border" /></div> : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-warning">
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id}>
                    <td>{new Date(log.time).toLocaleString()}</td>
                    <td>{log.user?.name || 'System'}</td>
                    <td>{log.action}</td>
                    <td>{log.details}</td>
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

export default AuditLogs; 