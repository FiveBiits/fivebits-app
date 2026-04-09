import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { HiOutlineSearch, HiOutlineCurrencyDollar, HiOutlineDocumentText, HiOutlineLocationMarker, HiOutlineStar, HiOutlineShieldCheck, HiArrowRight } from 'react-icons/hi';
import '../styles/home.css';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); observer.unobserve(el); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <main className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero-content">
          <h1>
            Find Your Perfect<br />
            <span className="hero-highlight">Boarding Place</span>
          </h1>
          <p className="hero-sub">
            Discover, compare, and book the best boarding places near your university.
            Smart recommendations, transparent pricing, and hassle-free management.
          </p>
          <div className="hero-btns">
            <Link to="/browse" className="btn btn-white btn-lg">
              Browse Places <HiArrowRight />
            </Link>
            <Link to="/signup" className="btn btn-ghost btn-lg">
              Get Started
            </Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">150+</div>
            <div className="hero-stat-label">Boarding Places</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <div className="hero-stat-num">500+</div>
            <div className="hero-stat-label">Happy Students</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <div className="hero-stat-num">50+</div>
            <div className="hero-stat-label">Verified Owners</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <div className="hero-stat-num">4.8</div>
            <div className="hero-stat-label">Average Rating</div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <Reveal>
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2>Why Choose FiveBits?</h2>
            <p>Everything you need to find and manage your boarding place in one platform</p>
          </div>
        </Reveal>
        <div className="features-grid">
          {[
            { icon: <HiOutlineSearch />, title: 'Smart Search', desc: 'Search by location, price range, and facilities. Our algorithm recommends the best places for your preferences.', delay: 0 },
            { icon: <HiOutlineLocationMarker />, title: 'Distance Calculator', desc: 'See exactly how far each place is from your university. Make informed decisions based on real distance data.', delay: 80 },
            { icon: <HiOutlineCurrencyDollar />, title: 'Online Payments', desc: 'Pay boarding fees and utility bills securely online. Track all payments in one place with detailed receipts.', delay: 160 },
            { icon: <HiOutlineStar />, title: 'Top Recommendations', desc: 'Get personalized top 5 recommendations ranked by distance, price, and ratings — tailored just for you.', delay: 240 },
            { icon: <HiOutlineDocumentText />, title: 'Issue Tracking', desc: 'Report maintenance issues and track their resolution status. Stay informed from submission to resolution.', delay: 320 },
            { icon: <HiOutlineShieldCheck />, title: 'Verified Listings', desc: 'All boarding places are verified by our admin team. Browse with confidence knowing every listing is authenticated.', delay: 400 },
          ].map((f, i) => (
            <Reveal key={i} delay={f.delay}>
              <div className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="how-it-works">
        <Reveal>
          <div className="section-header">
            <span className="section-tag">Process</span>
            <h2>How It Works</h2>
            <p>Get started in just a few simple steps</p>
          </div>
        </Reveal>
        <div className="steps">
          {[
            { num: '01', title: 'Create Account', desc: 'Sign up as a student or boarding owner in seconds' },
            { num: '02', title: 'Search & Discover', desc: 'Browse boarding places with smart filters and recommendations' },
            { num: '03', title: 'Book Your Place', desc: 'Request a booking and get confirmed by the owner' },
            { num: '04', title: 'Manage Everything', desc: 'Pay bills, track issues, and manage your stay from your dashboard' },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="step">
                <div className="step-num">{s.num}</div>
                <div className="step-line" />
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta">
        <Reveal>
          <div className="cta-inner">
            <h2>Ready to Find Your<br />Boarding Place?</h2>
            <p>Join hundreds of students who found their ideal accommodation through FiveBits</p>
            <Link to="/signup" className="btn btn-white btn-lg">
              Create Free Account <HiArrowRight />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
