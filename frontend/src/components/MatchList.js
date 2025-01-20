import React, { useState, useEffect } from 'react';
import MatchCard from './MatchCard';
import '../style/MatchList.css';

const MatchList = () => {
  const [matches, setMatches] = useState([]);

  const fetchMatches = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/matches');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const sortedMatches = data.sort(
        (a, b) => new Date(a.match_date) - new Date(b.match_date)
      );
      setMatches(sortedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const generateMatches = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/matches/generate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchMatches();
    } catch (error) {
      console.error('Error generating matches:', error);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="match-list">
      <h2>Upcoming Matches</h2>
      {matches.length === 0 ? (
        <p>No matches found. Please try again later.</p>
      ) : (
        <div className="match-card-container">
          {matches.map((match) => (
            <MatchCard key={match.match_id} match={match} />
          ))}
        </div>
      )}
      <button onClick={generateMatches}>Add Matches of New Arrivals</button>
    </div>
  );
};

export default MatchList;
