import React from 'react';

const Navbar = ({ onMenuClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Mobile menu button */}
        <button className="menu-toggle" onClick={onMenuClick}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Logo/Title */}
        <div className="navbar-brand">
          <span className="brand-icon">💬</span>
          <h1 className="brand-title">ChitChatty</h1>
        </div>

        {/* User profile section */}
        <div className="navbar-user">
          <div className="user-avatar">
            <span className="user-emoji">👨‍💻</span>
          </div>
          <div className="user-info">
            <span className="user-name">Ved</span>
            <span className="user-status">Online</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;