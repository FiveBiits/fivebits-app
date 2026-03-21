import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { AuthProvider } from './context/AuthContext';
import NavBar from './layouts/navbar';
import Footer from './layouts/footer';

import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Services from './pages/services';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import StudentDashboard from './pages/StudentDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import PrivateRoute from './components/PrivateRoute';

const pageTitles = {
  '/':                  'FiveBits | An Online Boarding Place Discovery and Management System',
  '/about':             'About | FiveBits',
  '/contact':           'Contact | FiveBits',
  '/services':          'Services | FiveBits',
  '/signin':            'Sign In | FiveBits',
  '/signup':            'Sign Up | FiveBits',
  '/student/dashboard': 'Dashboard | FiveBits',
  '/owner/dashboard':   'Dashboard | FiveBits',
};

// Navbar is now shown on dashboard routes too
const noFooterRoutes = [];
const noNavbarRoutes = [];

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    document.title = pageTitles[location.pathname] || 'FiveBits';
  }, [location]);

  const showNavbar = !noNavbarRoutes.includes(location.pathname);
  const showFooter = !noFooterRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <NavBar />}
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/about"   element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/signin"  element={<SignIn />} />
        <Route path="/signup"  element={<SignUp />} />
        <Route path="/student/dashboard" element={
          <PrivateRoute role="STUDENT"><StudentDashboard /></PrivateRoute>
        } />
        <Route path="/owner/dashboard" element={
          <PrivateRoute role="OWNER"><OwnerDashboard /></PrivateRoute>
        } />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;