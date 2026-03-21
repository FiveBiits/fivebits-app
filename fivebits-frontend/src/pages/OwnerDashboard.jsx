import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Active Listings',  value: '0' },
    { label: 'Total Inquiries',  value: '0' },
    { label: 'Current Tenants',  value: '0' },
    { label: 'Available Rooms',  value: '0' },
  ];

  const navItems = [
    {
      label: 'Dashboard',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
      active: true,
    },
    {
      label: 'My Listings',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
    },
    {
      label: 'Inquiries',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
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
            <p className="db-label">OWNER DASHBOARD</p>
            <h1 className="db-greeting">Welcome back, {user?.name}.</h1>
            <p className="db-sub">Manage your listings and track your rentals.</p>
          </div>
          <button className="db-add-btn" onClick={() => navigate('#')}>
            + Add New Listing
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
        <div className="db-stats">
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
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
              <path d="M9 21V12h6v9"/>
            </svg>
          </div>
          <p className="db-empty-title">No listings yet</p>
          <p className="db-empty-sub">Click <strong>+ Add New Listing</strong> to get started.</p>
        </div>

      </div>
    </div>
  );
}