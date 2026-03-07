import { Link } from 'react-router-dom';
import './navbar.css';

import alien from '../assets/logo.png';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/"><img src={alien} alt="FiveBits Logo" /></Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">HOME</Link></li>
        <li><Link to="/about">ABOUT</Link></li>
        <li><Link to="/contact">CONTACT</Link></li>
        <li><Link to="/services">SERVICES</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;