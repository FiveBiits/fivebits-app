import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Available Boardings', value: '24' },
    { label: 'Saved Places',        value: '3'  },
    { label: 'Applications Sent',   value: '1'  },
  ];

  const navItems = [
    {
      label: 'Dashboard',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
      active: true,
    },
    {
      label: 'Browse Boardings',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    },
    {
      label: 'Saved Places',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    },
    {
      label: 'My Applications',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    },
    {
      label: 'My Profile',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
  ];

  return (
    <div className="db-page">
      <div className="db-wrapper">

        {/* ── Page header ── */}
        <div className="db-header">
          <div>
            <p className="db-label">STUDENT DASHBOARD</p>
            <h1 className="db-greeting">Welcome back, {user?.name}.</h1>
            <p className="db-sub">Find your perfect boarding place.</p>
          </div>
          <button className="db-add-btn" onClick={() => navigate('#')}>
            Browse Boardings
          </button>
        </div>

        {/* ── Tab nav ── */}
        <nav className="db-tabs">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`db-tab ${item.active ? 'db-tab--active' : ''}`}
            >
              <span className="db-tab-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* ── Stats ── */}
        <div className="db-stats db-stats--3">
          {stats.map((s) => (
            <div key={s.label} className="db-stat-card">
              <span className="db-stat-value">{s.value}</span>
              <span className="db-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Empty state ── */}
        <div className="db-empty">
          <div className="db-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <p className="db-empty-title">No listings found</p>
          <p className="db-empty-sub">Browse available boarding places to get started.</p>
        </div>

      </div>
    </div>
  );
}