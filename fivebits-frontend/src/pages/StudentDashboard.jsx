import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export default function StudentDashboard() {
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Browse Boardings
          </a>
          <a href="#" className="dash-navlink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Saved Places
          </a>
          <a href="#" className="dash-navlink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            My Applications
          </a>
          <a href="#" className="dash-navlink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            My Profile
          </a>
        </nav>
        <button onClick={handleLogout} className="dash-logout">Logout</button>
      </aside>

      <main className="dash-main">
        <h1 className="dash-greeting">Welcome, {user?.name}</h1>
        <p className="dash-sub">Find your perfect boarding place.</p>

        <div className="dash-grid dash-grid--3">
          {[
            { label: 'Available Boardings', value: '24' },
            { label: 'Saved Places',        value: '3'  },
            { label: 'Applications Sent',   value: '1'  },
          ].map((s) => (
            <div key={s.label} className="dash-card">
              <span className="dash-card-value">{s.value}</span>
              <span className="dash-card-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="dash-placeholder">
          Boarding listings will appear here.
        </div>
      </main>
    </div>
  );
}