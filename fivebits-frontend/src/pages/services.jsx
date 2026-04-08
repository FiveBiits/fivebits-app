import { HiOutlineMagnifyingGlass, HiOutlineClipboardDocumentCheck, HiOutlineCreditCard, HiOutlineChatBubbleLeftRight, HiOutlineShieldCheck, HiOutlineChartBar } from 'react-icons/hi2';
import '../styles/services.css';

const services = [
  { icon: <HiOutlineMagnifyingGlass />, bg: '#dbeafe', color: '#2563eb', title: 'Smart Discovery', desc: 'Find the perfect boarding place with our intelligent search engine. Filter by location, price, distance to university, and ratings.' },
  { icon: <HiOutlineClipboardDocumentCheck />, bg: '#d1fae5', color: '#059669', title: 'Easy Booking', desc: 'Request a booking in one click. Owners receive instant notifications and can confirm or manage bookings from their dashboard.' },
  { icon: <HiOutlineCreditCard />, bg: '#fef3c7', color: '#d97706', title: 'Secure Payments', desc: 'Pay your monthly rent and utility bills securely through the platform. Track every transaction with receipts and payment history.' },
  { icon: <HiOutlineChatBubbleLeftRight />, bg: '#ede9fe', color: '#7c3aed', title: 'Issue Reporting', desc: 'Report maintenance issues directly. Owners can track, assign, and resolve issues with full transparency for both parties.' },
  { icon: <HiOutlineShieldCheck />, bg: '#fee2e2', color: '#dc2626', title: 'Verified Listings', desc: 'Our admin team verifies boarding places to ensure quality. Look for the verified badge when browsing listings.' },
  { icon: <HiOutlineChartBar />, bg: '#f3f4f6', color: '#374151', title: 'Dashboard Analytics', desc: 'Both students and owners get dedicated dashboards with real-time stats, history tracking, and management tools.' },
];

export default function Services() {
  return (
    <main className="services-page">
      <h1>Our Services</h1>
      <p className="services-lead">Everything you need to discover, book, and manage boarding places in one platform.</p>
      <div className="service-grid">
        {services.map(s => (
          <div className="service-item" key={s.title}>
            <div className="service-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
