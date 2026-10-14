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
      admin: 'Admin',
      farmer: 'Farmer',
      buyer: 'Buyer'
    };
    return labels[role] || role;
  };

  const isFarmer = user?.role === 'farmer';
  const profilePath = isFarmer ? '/farmer/profile' : null;

  const userInfoContent = (
    <>
      <span className="user-avatar">
        {user?.name?.charAt(0) || 'U'}
      </span>
      <div className="user-info">
        <span className="user-name">{user?.name || 'User'}</span>
        <span className="user-role">{getRoleDisplay(user?.role)}</span>
      </div>
    </>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-text">ZAMOREX</span>
        </Link>

        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger"></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          {isFarmer ? (
            <Link 
              to={profilePath} 
              className="navbar-user navbar-user-link"
              title="View / Edit your profile"
            >
              {userInfoContent}
            </Link>
          ) : (
            <div className="navbar-user">
              {userInfoContent}
            </div>
          )}
          
          <button className="navbar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;