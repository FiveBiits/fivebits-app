import { Link } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineCurrencyDollar, HiOutlineDocumentText, HiOutlineLocationMarker, HiOutlineStar, HiOutlineShieldCheck } from 'react-icons/hi';
import '../styles/home.css';

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>Find Your Perfect<br /><em>Boarding Place</em></h1>
          <p>Discover, compare, and book the best boarding places near your university. Smart recommendations, transparent pricing, and hassle-free management.</p>
          <div className="hero-btns">
            <Link to="/browse" className="btn btn-accent btn-lg">Browse Places</Link>
            <Link to="/signup" className="btn btn-outline btn-lg" style={{borderColor:'rgba(255,255,255,0.4)',color:'white'}}>Get Started</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-num">150+</div><div className="hero-stat-label">Boarding Places</div></div>
            <div className="hero-stat"><div className="hero-stat-num">500+</div><div className="hero-stat-label">Happy Students</div></div>
            <div className="hero-stat"><div className="hero-stat-num">50+</div><div className="hero-stat-label">Verified Owners</div></div>
            <div className="hero-stat"><div className="hero-stat-num">4.8</div><div className="hero-stat-label">Average Rating</div></div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-header">
          <h2>Why Choose FiveBits?</h2>
          <p>Everything you need to find and manage your boarding place in one platform</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon blue"><HiOutlineSearch /></div>
            <h3>Smart Search</h3>
            <p>Search boarding places by location, price range, and facilities. Our algorithm recommends the top 5 places based on your preferences.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon green"><HiOutlineLocationMarker /></div>
            <h3>Distance Calculator</h3>
            <p>See exactly how far each boarding place is from your university. Make informed decisions based on real distance data.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon amber"><HiOutlineCurrencyDollar /></div>
            <h3>Online Payments</h3>
            <p>Pay your boarding fees and utility bills securely online. Track all your payments in one place with detailed receipts.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon purple"><HiOutlineStar /></div>
            <h3>Top Recommendations</h3>
            <p>Get personalized top 5 boarding place recommendations ranked by distance, price, and ratings — tailored just for you.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon red"><HiOutlineDocumentText /></div>
            <h3>Issue Tracking</h3>
            <p>Report maintenance issues and track their resolution status. Stay informed from submission to resolution.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon teal"><HiOutlineShieldCheck /></div>
            <h3>Verified Listings</h3>
            <p>All boarding places are verified by our admin team. Browse with confidence knowing every listing is authenticated.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get started in just a few simple steps</p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <h3>Create Account</h3>
            <p>Sign up as a student or boarding owner in seconds</p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>Search & Discover</h3>
            <p>Browse boarding places with smart filters and recommendations</p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Book Your Place</h3>
            <p>Request a booking and get confirmed by the owner</p>
          </div>
          <div className="step">
            <div className="step-num">4</div>
            <h3>Manage Everything</h3>
            <p>Pay bills, track issues, and manage your stay from your dashboard</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Find Your Boarding Place?</h2>
          <p>Join hundreds of students who found their ideal accommodation through FiveBits</p>
          <Link to="/signup" className="btn btn-accent btn-lg">Create Free Account</Link>
        </div>
      </section>
    </main>
  );
}
