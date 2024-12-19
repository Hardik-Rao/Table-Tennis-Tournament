import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Header.css';  // Ensure the correct CSS file is imported

const Header = () => {
  return (
    <header>
        <h1 className="tournament-heading">Table Tennis Tournament</h1>
      <div className="header-bottom">
        <div className="left-buttons">
          <button className="nav-button">
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Players</Link>
          </button>
          <button className="nav-button">
            <Link to="/matches" style={{ color: 'white', textDecoration: 'none' }}>Matches</Link>
          </button>
          <button className="nav-button">
            <Link to="/live-scores" style={{ color: 'white', textDecoration: 'none' }}>Live Scores</Link>
          </button>
          <button className="nav-button">
            <Link to="/meal-tracking" style={{ color: 'white', textDecoration: 'none' }}>Meal Tracking</Link>
          </button>
          <button className="nav-button">
            <Link to="/rankings" style={{ color: 'white', textDecoration: 'none' }}>Rankings</Link>
          </button>
        </div>
        <div className="right-button">
          <button className="login-button">
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Register Here!</Link>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
