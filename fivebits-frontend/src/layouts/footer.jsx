import { Link } from 'react-router-dom';
import './footer.css';
import alien from '../assets/logo.png';

function Footer() {
  return (
    <footer className="footer">
        <div className="footer-logo left">
        <Link to="/"><img src={alien} alt="FiveBits Logo" /></Link>
      </div>
      <p>© 2026 FIVEBITS. ALL RIGHTS RESERVED.</p>
      <div className="footer-logo right">
        <Link to="/"><img src={alien} alt="FiveBits Logo" /></Link>
      </div>
    </footer>
  );
}

export default Footer;