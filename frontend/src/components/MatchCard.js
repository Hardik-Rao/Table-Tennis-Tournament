// src/components/MatchCard.js
import React from 'react';
import '../style/MatchCard.css';
const MatchCard = ({ match }) => {
  const { team1, team2, team1_score, team2_score, match_date, venue } = match;

  return (
    <div className="match-card">
      <div className="match-header">
        <h3>{team1} vs {team2}</h3>
      </div>
      <div className="match-details">
        <p><strong>Date:</strong> {new Date(match_date).toLocaleString()}</p>
        <p><strong>Venue:</strong> {venue}</p>
        <p><strong>Score:</strong> {team1_score} - {team2_score}</p>
      </div>
    </div>
  );
};

export default MatchCard;
