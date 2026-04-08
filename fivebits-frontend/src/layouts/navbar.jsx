import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { HiOutlineHome, HiOutlineInformationCircle, HiOutlinePhone, HiOutlineCog, HiOutlineSearch } from 'react-icons/hi';
import { HiOutlineArrowRightOnRectangle, HiOutlineUser, HiOutlineArrowRightEndOnRectangle, HiOutlineUserPlus } from 'react-icons/hi2';
import logo from '../assets/logo.png';
import './navbar.css';

export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
          <img src={logo} alt="FiveBits" className="navbar-logo-img" />
        </Link>

        <ul className="navbar-links">
          <li><Link to="/" className={isActive('/')}><HiOutlineHome size={22}/><span className="nav-label">HOME</span></Link></li>
          <li><Link to="/browse" className={isActive('/browse')}><HiOutlineSearch size={22}/><span className="nav-label">BROWSE</span></Link></li>
          <li><Link to="/about" className={isActive('/about')}><HiOutlineInformationCircle size={22}/><span className="nav-label">ABOUT</span></Link></li>
          <li><Link to="/services" className={isActive('/services')}><HiOutlineCog size={22}/><span className="nav-label">SERVICES</span></Link></li>
          <li><Link to="/contact" className={isActive('/contact')}><HiOutlinePhone size={22}/><span className="nav-label">CONTACT</span></Link></li>
        </ul>

        <div className="navbar-actions">
          {user ? (
              <div className="navbar-user" ref={dropdownRef}>
                <button className="navbar-profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)} title={user.name}>
                  <HiOutlineUser size={20} />
                </button>
                {dropdownOpen && (
                  <div className="navbar-dropdown">
                    <div className="navbar-dropdown-header">
                      <span className="navbar-dropdown-name">{user.name}</span>
                      <span className="navbar-dropdown-role">{user.userType?.toLowerCase()}</span>
                    </div>
                    <div className="navbar-dropdown-divider" />
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
                <Link to="/signin" className="btn btn-outline btn-sm" title="Sign In">
                  <HiOutlineArrowRightEndOnRectangle size={20} />
                  <span className="btn-label">Sign In</span>
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm" title="Sign Up">
                  <HiOutlineUserPlus size={20} />
                  <span className="btn-label">Sign Up</span>
                </Link>
              </>
            )}
        </div>
      </div>
    </nav>
  );
}
