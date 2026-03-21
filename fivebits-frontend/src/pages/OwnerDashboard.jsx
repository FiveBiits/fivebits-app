import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="dash-page">

      {/* Mobile topbar */}
      <div className="dash-topbar">
        <button className="dash-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span /><span /><span />
        </button>
        <span className="dash-topbar-title">FiveBits</span>
        <div className="dash-topbar-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
      </div>

      {sidebarOpen && <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`dash-sidebar ${sidebarOpen ? 'dash-sidebar--open' : ''}`}>
        <div className="dash-logo">FiveBits</div>
        <nav className="dash-nav">
          <a href="#" className="dash-navlink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </a>
          <a href="#" className="dash-navlink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Listing
          </a>
          <a href="#" className="dash-navlink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
            My Listings
          </a>
          <a href="#" className="dash-navlink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Inquiries
          </a>
          <a href="#" className="dash-navlink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            My Profile
          </a>
        </nav>
        <button onClick={handleLogout} className="dash-logout">Logout</button>
      </aside>

      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1 className="dash-greeting">Owner Dashboard</h1>
            <p className="dash-sub">Manage your listings, {user?.name}.</p>
          </div>
          <button className="dash-add-btn">+ Add New Listing</button>
        </div>

        <div className="dash-grid dash-grid--4">
          {[
            { label: 'Active Listings',  value: '0' },
            { label: 'Total Inquiries',  value: '0' },
            { label: 'Current Tenants',  value: '0' },
            { label: 'Available Rooms',  value: '0' },
          ].map((s) => (
            <div key={s.label} className="dash-card">
              <span className="dash-card-value">{s.value}</span>
              <span className="dash-card-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="dash-placeholder">
          You have no listings yet. Click <strong>+ Add New Listing</strong> to get started.
        </div>
      </main>
    </div>
  );
}