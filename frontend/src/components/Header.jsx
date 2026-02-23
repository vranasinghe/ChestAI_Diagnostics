import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Header = () => {
  return (
    <header className="header container">
      <div className="header-container">
        <div className="logo-container">
          <div className="logo-text">Wedakam</div>
          <div className="logo-icon"></div>
        </div>

        <nav className="nav-links">
          <a href="#home" className="nav-link">Home</a>
          <a href="#services" className="nav-link">Services</a>
          <a href="#product" className="nav-link">Product</a>
          <a href="#about" className="nav-link">About Us</a>
        </nav>

        <div className="header-actions">
          <Link to="/register" className="pill-btn btn-cyan" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Register</Link>
          <Link to="/login" className="pill-btn btn-cyan" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Log in</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
