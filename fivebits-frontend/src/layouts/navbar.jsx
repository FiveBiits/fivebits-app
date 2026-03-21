import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './navbar.css';
import alien from '../assets/logo.png';

const NAV_ITEMS = [
  {
    to: '/', label: 'HOME',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    to: '/about', label: 'ABOUT',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8.5"/><line x1="12" y1="11" x2="12" y2="17"/>
      </svg>
    ),
  },
  {
    to: '/contact', label: 'CONTACT',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.09 4.18 2 2 0 0 1 5.09 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
  },
  {
    to: '/services', label: 'SERVICES',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
  },
];

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/"><img src={alien} alt="FiveBits Logo" /></Link>
      </div>

      {/* Desktop links */}
      <ul className="navbar-links">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <li key={to}>
            <Link to={to} className={location.pathname === to ? 'active' : ''}>
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="navbar-auth">
        {user ? (
          <div className="user-menu" ref={dropdownRef}>
            <button className="user-icon-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
            </button>
            {dropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <span className="dropdown-name">{user.name}</span>
                  <span className="dropdown-role">{user.userType}</span>
                </div>
                <hr className="dropdown-divider" />
                <button className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate(user.userType === 'STUDENT' ? '/student/dashboard' : '/owner/dashboard'); }}>
                  Dashboard
                </button>
                <button className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>
                  My Profile
                </button>
                <hr className="dropdown-divider" />
                <button className="dropdown-item dropdown-item--logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signin" className="signin-btn">
            <span className="signin-label">SIGN IN</span>
            <span className="signin-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
            </span>
          </Link>
        )}

        {/* Hamburger for mobile */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
          <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
          <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <Link key={to} to={to} className={`mobile-link ${location.pathname === to ? 'active' : ''}`}>
            <span className="mobile-icon">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
        {!user && (
          <Link to="/signin" className="mobile-link mobile-link--signin">
            <span className="mobile-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
            </span>
            <span>SIGN IN</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;