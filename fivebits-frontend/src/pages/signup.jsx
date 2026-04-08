import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signUp } from '../services/authService';
import '../styles/auth.css';

export default function SignUp() {
  const [role, setRole] = useState('STUDENT');
  const [form, setForm] = useState({ name:'', email:'', password:'', phoneNumber:'', university:'', courseOfStudy:'', studentId:'', businessName:'', address:'', nicNumber:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({...form, [field]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signUp({ ...form, userType: role });
      const data = res.data;
      authLogin(data.token, { id: data.id, name: data.name, email: data.email, userType: data.userType });
      navigate(data.userType === 'OWNER' ? '/owner/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card" style={{maxWidth: 520}}>
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join FiveBits as a student or boarding owner</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="role-toggle">
            <button type="button" className={role === 'STUDENT' ? 'active' : ''} onClick={() => setRole('STUDENT')}>Student</button>
            <button type="button" className={role === 'OWNER' ? 'active' : ''} onClick={() => setRole('OWNER')}>Boarding Owner</button>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" required value={form.name} onChange={set('name')} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="+94 77 123 4567" value={form.phoneNumber} onChange={set('phoneNumber')} />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" required value={form.email} onChange={set('email')} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Create a strong password" required minLength={6} value={form.password} onChange={set('password')} />
          </div>

          {role === 'STUDENT' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>University</label>
                  <input type="text" placeholder="University of Moratuwa" value={form.university} onChange={set('university')} />
                </div>
                <div className="form-group">
                  <label>Student ID</label>
                  <input type="text" placeholder="240347J" value={form.studentId} onChange={set('studentId')} />
                </div>
              </div>
              <div className="form-group">
                <label>Course of Study</label>
                <input type="text" placeholder="Computer Science" value={form.courseOfStudy} onChange={set('courseOfStudy')} />
              </div>
            </>
          )}

          {role === 'OWNER' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Business Name</label>
                  <input type="text" placeholder="My Boarding House" value={form.businessName} onChange={set('businessName')} />
                </div>
                <div className="form-group">
                  <label>NIC Number</label>
                  <input type="text" placeholder="200012345678" value={form.nicNumber} onChange={set('nicNumber')} />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" placeholder="123 Main Street, Moratuwa" value={form.address} onChange={set('address')} />
              </div>
            </>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/signin">Sign In</Link>
        </div>
      </div>
    </main>
  );
}
