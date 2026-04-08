import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { HiOutlineHome, HiOutlineInformationCircle, HiOutlinePhone, HiOutlineCog, HiOutlineSearch } from 'react-icons/hi';
import { HiOutlineArrowRightOnRectangle, HiOutlineChevronDown, HiOutlineUser, HiBars3 } from 'react-icons/hi2';
import './navbar.css';

export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const dashboardPath = user?.userType === 'OWNER' ? '/owner/dashboard' : '/student/dashboard';

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span>FiveBits</span>
        </Link>

        <button className="navbar-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          <HiBars3 />
        </button>

        <ul className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <li><Link to="/" className={isActive('/')} onClick={() => setMobileOpen(false)}><HiOutlineHome size={16}/>Home</Link></li>
          <li><Link to="/browse" className={isActive('/browse')} onClick={() => setMobileOpen(false)}><HiOutlineSearch size={16}/>Browse</Link></li>
          <li><Link to="/about" className={isActive('/about')} onClick={() => setMobileOpen(false)}><HiOutlineInformationCircle size={16}/>About</Link></li>
          <li><Link to="/services" className={isActive('/services')} onClick={() => setMobileOpen(false)}><HiOutlineCog size={16}/>Services</Link></li>
          <li><Link to="/contact" className={isActive('/contact')} onClick={() => setMobileOpen(false)}><HiOutlinePhone size={16}/>Contact</Link></li>
        </ul>

        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user" ref={dropdownRef}>
              <button className="navbar-user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="navbar-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <div className="navbar-user-info">
                  <div className="navbar-user-name">{user.name}</div>
                  <div className="navbar-user-role">{user.userType?.toLowerCase()}</div>
                </div>
                <HiOutlineChevronDown size={14} />
              </button>
              {dropdownOpen && (
                <div className="navbar-dropdown">
                  <Link to={dashboardPath} onClick={() => setDropdownOpen(false)}>
                    <HiOutlineUser size={16} /> Dashboard
                  </Link>
                  <div className="navbar-dropdown-divider" />
                  <button className="logout" onClick={handleLogout}>
                    <HiOutlineArrowRightOnRectangle size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/signin" className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
