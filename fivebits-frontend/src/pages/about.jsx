import '../styles/about.css';

const team = [
  { name: 'Aviya', initials: 'A' },
  { name: 'Member 2', initials: 'M2' },
  { name: 'Member 3', initials: 'M3' },
  { name: 'Member 4', initials: 'M4' },
  { name: 'Member 5', initials: 'M5' },
];

export default function About() {
  return (
    <main className="about-page">
      <h1>About FiveBits</h1>
      <p className="about-lead">
        We are building a modern platform that connects university students with quality boarding places,
        making the search, booking, and management process seamless for everyone.
      </p>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Finding a boarding place near your university can be stressful and time-consuming. FiveBits solves this 
          by providing an online platform where students can discover verified boarding places, compare prices, 
          read reviews, and book directly — all from one place.
        </p>
        <p>
          For boarding owners, FiveBits offers tools to manage listings, handle bookings, receive payments, 
          and communicate with tenants efficiently through a dedicated dashboard.
        </p>
      </section>

      <section className="about-section">
        <h2>What We Offer</h2>
        <p>
          <strong>For Students:</strong> Search by location, filter by price, view verified listings with genuine 
          ratings, request bookings with one click, track payments, and report maintenance issues.
        </p>
        <p>
          <strong>For Boarding Owners:</strong> List your properties with photos and details, manage booking 
          requests, track revenue, handle issue reports, and keep your tenants happy.
        </p>
        <p>
          <strong>Smart Recommendations:</strong> Our ranking algorithm considers distance to university, 
          monthly price, and user ratings to surface the best options for each student.
        </p>
      </section>

      <section className="about-section">
        <h2>Team FiveBits</h2>
        <div className="team-grid">
          {team.map(m => (
            <div className="team-card" key={m.name}>
              <div className="team-avatar">{m.initials}</div>
              <h4>{m.name}</h4>
              <p>Developer</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
