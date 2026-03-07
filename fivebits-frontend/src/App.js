import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import NavBar from './layouts/navbar';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Services from './pages/services';
import Footer from './layouts/footer';


const pageTitles = {
  '/': 'FiveBits | An Online Boarding Place Discovery and Management System',
  '/about': 'About | FiveBits',
  '/contact': 'Contact | FiveBits',
  '/services': 'Services | FiveBits'
};

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    document.title = pageTitles[location.pathname] || 'FiveBits';
  }, [location]);

  return (
    <>
      <NavBar>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </NavBar>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/about"    element={<About />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="/services" element={<Services />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;