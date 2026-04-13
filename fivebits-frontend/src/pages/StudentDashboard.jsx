import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentStats } from '../services/dashboardService';
import { getStudentBookings, cancelBooking } from '../services/bookingService';
import { getStudentPayments } from '../services/paymentService';
import { getStudentIssues, submitIssue } from '../services/issueService';
import { getStudentBids, withdrawBid } from '../services/biddingService';
import {
  HiOutlineHome,
  HiOutlineCurrencyDollar,
  HiOutlineExclamationCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineXMark,
  HiOutlineCreditCard
} from 'react-icons/hi2';
import axios from 'axios';
import '../styles/dashboard.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [bids, setBids] = useState([]);
  const [issues, setIssues] = useState([]);
  const [issueForm, setIssueForm] = useState({ placeId: '', description: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user?.id) {
      getStudentStats(user.id).then(r => setStats(r.data)).catch(() => {});
      getStudentBookings(user.id).then(r => setBookings(r.data)).catch(() => {});
      getStudentPayments(user.id).then(r => setPayments(r.data)).catch(() => {});
      getStudentBids(user.id).then(r => setBids(r.data)).catch(() => {});
      getStudentIssues(user.id).then(r => setIssues(r.data)).catch(() => {});
    }
  }, [user]);

  const handlePayment = async (booking) => {
    try {
      setMsg("Initiating payment...");
      
      const paymentRequest = {
        studentId: user.id, 
        placeId: booking.placeId,
        bookingId: booking.id,
        amount: booking.placePrice,
        method: "PAYHERE",
        type: "BOARDING_FEE"
      };

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const response = await axios.post(`${apiUrl}/api/payments/create`, paymentRequest);
      const data = response.data;

      // Validation check for backend response
      if (!data.hash || !data.merchantId) {
        setMsg("Error: Missing security keys from server.");
        return;
      }

      const paymentConfig = {
        "sandbox": true, 
        "merchant_id": data.merchantId,
        "return_url": "http://localhost:3000/payment-success",
        "cancel_url": "http://localhost:3000/student/dashboard",
        "notify_url": `${apiUrl}/api/payments/notify`,
        "order_id": data.transactionRef,
        "items": `Booking for ${booking.placeName}`,
        "amount": data.amount,
        "currency": "LKR",
        "hash": data.hash,
        "first_name": user.name || "Student",
        "last_name": "User",
        "email": user.email || "test@example.com",
        "phone": "0771234567",
        "address": "Moratuwa",
        "city": "Moratuwa",
        "country": "Sri Lanka",
      };

      window.payhere.onCompleted = function onCompleted(orderId) {
        console.log("Payment completed. OrderID: " + orderId);
        window.location.href = "/payment-success";
      };

      window.payhere.onDismissed = function onDismissed() {
        setMsg("Payment window closed.");
      };

      window.payhere.onError = function onError(error) {
        setMsg("PayHere Error: " + error);
      };

      window.payhere.startPayment(paymentConfig);

    } catch (err) {
      console.error("Payment initiation failed", err);
      setMsg("Failed to start payment: " + (err.response?.data?.message || "Check connection"));
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await cancelBooking(id);
      setBookings(bookings.map(b => b.id === id ? {...b, status: 'CANCELLED'} : b));
    } catch (err) { console.error(err); }
  };

  const handleSubmitIssue = async (e) => {
    e.preventDefault();
    try {
      await submitIssue({
        studentId: user.id,
        placeId: Number(issueForm.placeId),
        description: issueForm.description
      });
      setMsg('Issue submitted successfully');
      setIssueForm({ placeId: '', description: '' });
      getStudentIssues(user.id).then(r => setIssues(r.data));
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { setMsg(err.response?.data || 'Failed to submit issue'); }
  };

  const handleWithdrawBid = async (bidId) => {
    try {
      await withdrawBid(bidId);
      setMsg('Bid withdrawn successfully');
      getStudentBids(user.id).then(r => setBids(r.data));
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { setMsg('Failed to withdraw bid'); }
  };

  const statusBadge = (status) => {
    const map = { 
      REQUESTED: 'badge-warning', CONFIRMED: 'badge-info', ACTIVE: 'badge-success', 
      COMPLETED: 'badge-neutral', CANCELLED: 'badge-danger', SUCCESSFUL: 'badge-success' 
    };
    return <span className={`badge ${map[status] || 'badge-neutral'}`}>{status}</span>;
  };

  return (
    <main className="dashboard">
      <div className="dash-header">
        <div>
          <h1>Welcome back, {user?.name}</h1>
          <p>ID: {user?.id} | Role: Student</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><HiOutlineHome /></div>
          <div><div className="stat-value">{stats.activeBookings || 0}</div><div className="stat-label">Active Bookings</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><HiOutlineCurrencyDollar /></div>
          <div><div className="stat-value">{stats.totalPayments || 0}</div><div className="stat-label">Total Payments</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><HiOutlineExclamationCircle /></div>
          <div><div className="stat-value">{stats.pendingIssues || 0}</div><div className="stat-label">Pending Issues</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><HiOutlineClipboardDocumentList /></div>
          <div><div className="stat-value">{bookings.length}</div><div className="stat-label">Total Bookings</div></div>
        </div>
      </div>

      <div className="dash-tabs">
        <button className={`dash-tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
        <button className={`dash-tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>My Bookings</button>
        <button className={`dash-tab ${tab === 'bids' ? 'active' : ''}`} onClick={() => setTab('bids')}>My Bids</button>
        <button className={`dash-tab ${tab === 'payments' ? 'active' : ''}`} onClick={() => setTab('payments')}>Payments</button>
        <button className={`dash-tab ${tab === 'issues' ? 'active' : ''}`} onClick={() => setTab('issues')}>Issues</button>
      </div>

      {msg && <div className="status-msg">{msg}</div>}

      {tab === 'overview' && (
        <div className="dash-section">
          <h2>Recent Bookings</h2>
          {bookings.length === 0 ? (
            <div className="dash-empty"><h3>No bookings yet</h3></div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Place</th><th>Location</th><th>Status</th></tr></thead>
              <tbody>
                {bookings.slice(0, 5).map(b => (
                  <tr key={b.id}><td>{b.placeName}</td><td>{b.placeLocation}</td><td>{statusBadge(b.status)}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="dash-section">
          <h2>All Bookings</h2>
          <table className="dash-table">
            <thead><tr><th>Place</th><th>Price</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.placeName}</td>
                  <td>LKR {b.placePrice?.toLocaleString()}</td>
                  <td>{statusBadge(b.status)}</td>
                  <td className="actions-cell">
                    {b.status === 'CONFIRMED' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handlePayment(b)}>
                        <HiOutlineCreditCard /> Pay Now
                      </button>
                    )}
                    {(b.status === 'REQUESTED' || b.status === 'CONFIRMED') && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancelBooking(b.id)}>
                        <HiOutlineXMark /> Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'bids' && (
        <div className="dash-section">
          <h2>My Bids</h2>
          {bids.length === 0 ? (
            <div className="dash-empty"><h3>No bids yet</h3></div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Place</th><th>Offered Price</th><th>Original Price</th><th>Status</th><th>Created</th><th>Action</th></tr></thead>
              <tbody>
                {bids.map(b => (
                  <tr key={b.id}>
                    <td>{b.placeName}</td>
                    <td>LKR {b.offeredPrice?.toLocaleString()}</td>
                    <td>LKR {b.originalPrice?.toLocaleString()}</td>
                    <td>{statusBadge(b.status)}</td>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      {b.status === 'PENDING' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleWithdrawBid(b.id)}>
                          <HiOutlineXMark /> Withdraw
                        </button>
                      )}
                    </td>
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
          <table className="dash-table">
            <thead><tr><th>Place</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td>{p.placeName}</td>
                  <td>LKR {p.amount?.toLocaleString()}</td>
                  <td>{statusBadge(p.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'issues' && (
        <div className="dash-section">
          <h2>Support Issues</h2>
          <table className="dash-table">
            <thead><tr><th>Place</th><th>Description</th><th>Status</th></tr></thead>
            <tbody>
              {issues.map(issue => (
                <tr key={issue.id}>
                  <td>{issue.placeName}</td>
                  <td>{issue.description}</td>
                  <td>{statusBadge(issue.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}