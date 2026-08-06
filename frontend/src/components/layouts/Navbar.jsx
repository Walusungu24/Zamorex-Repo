import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getRoleDisplay = (role) => {
    const labels = {
      admin: '👑 Admin',
      farmer: '🌾 Farmer',
      buyer: '🛒 Buyer'
    };
    return labels[role] || role;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🌾</span>
          <span className="brand-text">Zamorex</span>
        </Link>

        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger"></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="navbar-user">
            <span className="user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </span>
            <div className="user-info">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-role">{getRoleDisplay(user?.role)}</span>
            </div>
          </div>
          <button className="navbar-logout" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;