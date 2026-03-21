import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function SignUp() {
  const { login: saveAuth } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', password: '', phoneNumber: '',
    university: '', courseOfStudy: '', studentId: '',
    businessName: '', address: '', nicNumber: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      phoneNumber: form.phoneNumber,
      userType,
      ...(userType === 'STUDENT' && {
        university: form.university,
        courseOfStudy: form.courseOfStudy,
        studentId: form.studentId,
      }),
      ...(userType === 'OWNER' && {
        businessName: form.businessName,
        address: form.address,
        nicNumber: form.nicNumber,
      }),
    };

    try {
      const { data } = await signUp(payload);
      saveAuth(data.token, {
        id: data.id,
        name: data.name,
        email: data.email,
        userType: data.userType,
      });
      navigate(data.userType === 'STUDENT' ? '/student/dashboard' : '/owner/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        'Registration failed. Please try again.';
      setError(String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card--wide">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join as a Student or Boarding Owner</p>

        <div className="type-toggle">
          <button type="button"
            className={`type-btn ${userType === 'STUDENT' ? 'active' : ''}`}
            onClick={() => setUserType('STUDENT')}>
            Student
          </button>
          <button type="button"
            className={`type-btn ${userType === 'OWNER' ? 'active' : ''}`}
            onClick={() => setUserType('OWNER')}>
            Boarding Owner
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
                placeholder="07X XXX XXXX" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="Min 8 characters" required minLength={8} />
            </div>
          </div>

          {userType === 'STUDENT' && (
            <div className="form-section">
              <h4 className="section-label">Student Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>University</label>
                  <input name="university" value={form.university} onChange={handleChange}
                    placeholder="e.g. University of Kelaniya" />
                </div>
                <div className="form-group">
                  <label>Course of Study</label>
                  <input name="courseOfStudy" value={form.courseOfStudy} onChange={handleChange}
                    placeholder="e.g. BSc Computer Science" />
                </div>
              </div>
              <div className="form-group">
                <label>Student ID</label>
                <input name="studentId" value={form.studentId} onChange={handleChange}
                  placeholder="e.g. KLN/CS/2022/001" />
              </div>
            </div>
          )}

          {userType === 'OWNER' && (
            <div className="form-section">
              <h4 className="section-label">Business Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Business / Boarding Name</label>
                  <input name="businessName" value={form.businessName} onChange={handleChange}
                    placeholder="e.g. Sunny Boarding House" />
                </div>
                <div className="form-group">
                  <label>NIC Number</label>
                  <input name="nicNumber" value={form.nicNumber} onChange={handleChange}
                    placeholder="e.g. 200012345678" />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input name="address" value={form.address} onChange={handleChange}
                  placeholder="No. 12, Main Street, Kurunegala" />
              </div>
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}