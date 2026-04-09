import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentStats } from '../services/dashboardService';
import { getStudentBookings, cancelBooking } from '../services/bookingService';
import { getStudentPayments } from '../services/paymentService';
import { getStudentIssues, submitIssue } from '../services/issueService';
import { HiOutlineHome, HiOutlineCurrencyDollar, HiOutlineExclamationCircle, HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import '../styles/dashboard.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [issues, setIssues] = useState([]);
  const [issueForm, setIssueForm] = useState({ placeId: '', description: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user?.id) {
      getStudentStats(user.id).then(r => setStats(r.data)).catch(() => {});
      getStudentBookings(user.id).then(r => setBookings(r.data)).catch(() => {});
      getStudentPayments(user.id).then(r => setPayments(r.data)).catch(() => {});
      getStudentIssues(user.id).then(r => setIssues(r.data)).catch(() => {});
    }
  }, [user]);

  const handleCancelBooking = async (id) => {
    try {
      await cancelBooking(id);
      setBookings(bookings.map(b => b.id === id ? {...b, status: 'CANCELLED'} : b));
    } catch (err) { console.error(err); }
  };

  const handleSubmitIssue = async (e) => {
    e.preventDefault();
    try {
      await submitIssue({ studentId: user.id, placeId: Number(issueForm.placeId), description: issueForm.description });
      setMsg('Issue submitted successfully');
      setIssueForm({ placeId: '', description: '' });
      getStudentIssues(user.id).then(r => setIssues(r.data));
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { setMsg(err.response?.data || 'Failed to submit issue'); }
  };

  const statusBadge = (status) => {
    const map = { REQUESTED: 'badge-warning', CONFIRMED: 'badge-info', ACTIVE: 'badge-success', COMPLETED: 'badge-neutral', CANCELLED: 'badge-danger', SUCCESSFUL: 'badge-success', RECEIPT_GENERATED: 'badge-success', CREATED: 'badge-warning', PROCESSING: 'badge-info', FAILED: 'badge-danger', SUBMITTED: 'badge-warning', ASSIGNED: 'badge-info', IN_PROGRESS: 'badge-info', RESOLVED: 'badge-success', CLOSED: 'badge-neutral' };
    return <span className={`badge ${map[status] || 'badge-neutral'}`}>{status}</span>;
  };

  return (
    <main className="dashboard">
      <div className="dash-header">
        <div>
          <h1>Welcome back, {user?.name}</h1>
          <p>Manage your boarding place, payments, and more</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon blue"><HiOutlineHome /></div><div><div className="stat-value">{stats.activeBookings || 0}</div><div className="stat-label">Active Bookings</div></div></div>
        <div className="stat-card"><div className="stat-icon green"><HiOutlineCurrencyDollar /></div><div><div className="stat-value">{stats.totalPayments || 0}</div><div className="stat-label">Total Payments</div></div></div>
        <div className="stat-card"><div className="stat-icon amber"><HiOutlineExclamationCircle /></div><div><div className="stat-value">{stats.pendingIssues || 0}</div><div className="stat-label">Pending Issues</div></div></div>
        <div className="stat-card"><div className="stat-icon purple"><HiOutlineClipboardDocumentList /></div><div><div className="stat-value">{bookings.length}</div><div className="stat-label">Total Bookings</div></div></div>
      </div>

      <div className="dash-tabs">
        <button className={`dash-tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
        <button className={`dash-tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>My Bookings</button>
        <button className={`dash-tab ${tab === 'payments' ? 'active' : ''}`} onClick={() => setTab('payments')}>Payments</button>
        <button className={`dash-tab ${tab === 'issues' ? 'active' : ''}`} onClick={() => setTab('issues')}>Issues</button>
      </div>

      {tab === 'overview' && (
        <div className="dash-section">
          <h2>Recent Bookings</h2>
          {bookings.length === 0 ? (
            <div className="dash-empty"><h3>No bookings yet</h3><p>Browse boarding places to make your first booking</p></div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Place</th><th>Location</th><th>Start Date</th><th>Status</th></tr></thead>
              <tbody>
                {bookings.slice(0, 5).map(b => (
                  <tr key={b.id}><td>{b.placeName}</td><td>{b.placeLocation}</td><td>{b.startDate}</td><td>{statusBadge(b.status)}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="dash-section">
          <h2>All Bookings</h2>
          {bookings.length === 0 ? (
            <div className="dash-empty"><h3>No bookings</h3><p>Browse boarding places to get started</p></div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Place</th><th>Location</th><th>Price</th><th>Start</th><th>End</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.placeName}</td>
                    <td>{b.placeLocation}</td>
                    <td>LKR {b.placePrice?.toLocaleString()}</td>
                    <td>{b.startDate}</td>
                    <td>{b.endDate || '—'}</td>
                    <td>{statusBadge(b.status)}</td>
                    <td>{(b.status === 'REQUESTED' || b.status === 'CONFIRMED') && <button className="btn btn-danger btn-sm" onClick={() => handleCancelBooking(b.id)}>Cancel</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'payments' && (
        <div className="dash-section">
          <h2>Payment History</h2>
          {payments.length === 0 ? (
            <div className="dash-empty"><h3>No payments yet</h3><p>Your payment history will appear here</p></div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Place</th><th>Amount</th><th>Type</th><th>Method</th><th>Status</th><th>Date</th><th>Ref</th></tr></thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td>{p.placeName}</td>
                    <td>LKR {p.amount?.toLocaleString()}</td>
                    <td>{p.type}</td>
                    <td>{p.method}</td>
                    <td>{statusBadge(p.status)}</td>
                    <td>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}</td>
                    <td style={{fontSize: 12, fontFamily: 'monospace'}}>{p.transactionRef}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'issues' && (
        <div className="dash-section">
          <h2>Report & Track Issues</h2>
          {msg && <div className="auth-error" style={{marginBottom: 16, background: msg.includes('success') ? '#d1fae5' : undefined, color: msg.includes('success') ? '#065f46' : undefined}}>{msg}</div>}
          <form onSubmit={handleSubmitIssue} style={{marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap'}}>
            <select
              className="form-group"
              style={{padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', flex: '0 0 200px'}}
              required
              value={issueForm.placeId}
              onChange={e => setIssueForm({...issueForm, placeId: e.target.value})}
            >
              <option value="">Select Boarding Place</option>
              {[...new Map(
                bookings
                  .filter(b => b.status === 'CONFIRMED' || b.status === 'ACTIVE')
                  .map(b => [b.placeId, b])
              ).values()].map(b => (
                <option key={b.placeId} value={b.placeId}>{b.placeName}</option>
              ))}
            </select>
            <input className="form-group" style={{padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', flex: 1}} placeholder="Describe the issue..." required value={issueForm.description} onChange={e => setIssueForm({...issueForm, description: e.target.value})} />
            <button type="submit" className="btn btn-primary">Submit Issue</button>
          </form>
          {issues.length === 0 ? (
            <div className="dash-empty"><h3>No issues reported</h3><p>Report maintenance issues here and track their progress</p></div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Place</th><th>Description</th><th>Status</th><th>Reply</th><th>Submitted</th></tr></thead>
              <tbody>
                {issues.map(i => (
                  <tr key={i.id}>
                    <td>{i.placeName}</td>
                    <td>{i.description}</td>
                    <td>{statusBadge(i.status)}</td>
                    <td>{i.reply || '—'}</td>
                    <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  );
}
