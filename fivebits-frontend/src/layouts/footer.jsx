import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-header">
            <img src={logo} alt="FiveBits" className="footer-logo" />
          </div>
          <p>An Online Boarding Place Discovery and Management System — helping students find the perfect boarding place near their university.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/browse">Browse Places</Link>
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
        </div>
        <div className="footer-col">
          <h4>For Users</h4>
          <Link to="/signup">Create Account</Link>
          <Link to="/signin">Sign In</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href="mailto:info@fivebits.lk">info@fivebits.lk</a>
          <a href="tel:+94771234567">+94 77 123 4567</a>
          <p style={{fontSize:'14px',color:'rgba(255,255,255,0.6)'}}>Moratuwa, Sri Lanka</p>
        </div>
      </div>
      <div className="footer-bottom">
        <img src={logo} alt="" className="footer-bottom-icon" />
        <span>&copy; {new Date().getFullYear()} FiveBits. ALL RIGHTS RESERVED.</span>
        <img src={logo} alt="" className="footer-bottom-icon" />
      </div>
    </footer>
  );
}
