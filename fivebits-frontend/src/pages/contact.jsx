import { useState } from 'react';
import '../styles/contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <main className="contact-page">
      <h1>Contact Us</h1>
      <p className="contact-lead">Have questions or feedback? We'd love to hear from you.</p>

      <div className="contact-form">
        {sent && <div className="auth-error" style={{ background: '#d1fae5', color: '#065f46' }}>Message sent! We'll get back to you soon.</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label>Your Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Send Message</button>
        </form>
      </div>

      <div className="contact-info">
        <div className="contact-info-item"><h4>Email</h4><p>support@fivebits.lk</p></div>
        <div className="contact-info-item"><h4>Phone</h4><p>+94 11 234 5678</p></div>
        <div className="contact-info-item"><h4>Location</h4><p>Moratuwa, Sri Lanka</p></div>
      </div>
    </main>
  );
}
