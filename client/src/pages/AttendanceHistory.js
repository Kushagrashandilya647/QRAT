import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useToaster } from '../components/Toaster';

function AttendanceHistory() {
  const { showToast } = useToaster();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [correctionReason, setCorrectionReason] = useState('');

  useEffect(() => {
    API.get('/attendance/history')
      .then(res => setRecords(res.data))
      .catch(() => showToast('Failed to load attendance', 'danger'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleExport = async () => {
    try {
      const res = await API.get('/attendance/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      showToast('Export failed', 'danger');
    }
  };

  const handleRequestCorrection = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleSubmitCorrection = async () => {
    try {
      await API.post('/attendance/correction', {
        sessionId: selectedRecord.session?._id,
        reason: correctionReason,
        markedAt: selectedRecord.markedAt,
      });
      showToast('Correction request submitted!', 'success');
      setShowModal(false);
      setCorrectionReason('');
    } catch {
      showToast('Failed to submit correction request', 'danger');
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold text-primary mb-0">Attendance History</h3>
          <button className="btn btn-outline-primary" onClick={handleExport}>Export CSV</button>
        </div>
        {loading ? <div className="text-center py-5"><span className="spinner-border" /></div> : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Session</th>
                  <th>Class</th>
                  <th>Valid From</th>
                  <th>Valid To</th>
                  <th>Marked At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r._id}>
                    <td>{r.session?.title}</td>
                    <td>{r.session?.class}</td>
                    <td>{r.session?.validFrom ? new Date(r.session.validFrom).toLocaleString() : ''}</td>
                    <td>{r.session?.validTo ? new Date(r.session.validTo).toLocaleString() : ''}</td>
                    <td>{r.markedAt ? new Date(r.markedAt).toLocaleString() : ''}</td>
                    <td><button className="btn btn-sm btn-outline-warning" onClick={() => handleRequestCorrection(r)}>Request Correction</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{background: 'rgba(0,0,0,0.4)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Attendance Correction</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2"><strong>Session:</strong> {selectedRecord?.session?.title}</div>
                <div className="mb-2"><strong>Date:</strong> {selectedRecord?.markedAt ? new Date(selectedRecord.markedAt).toLocaleString() : ''}</div>
                <textarea className="form-control" placeholder="Reason for correction" value={correctionReason} onChange={e => setCorrectionReason(e.target.value)} rows={3} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmitCorrection} disabled={!correctionReason}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceHistory; 