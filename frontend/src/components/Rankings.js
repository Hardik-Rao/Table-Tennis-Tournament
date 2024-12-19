import React, { useState, useEffect } from 'react';

const Rankings = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    fetch('/api/rankings')
      .then((response) => response.json())
      .then((data) => setRankings(data))
      .catch((error) => console.error('Error fetching rankings:', error));
  }, []);

  return (
    <div className="rankings">
      <h2>Rankings</h2>
      <ul>
        {rankings.map((ranking) => (
          <li key={ranking.id}>
            {ranking.player} - Rank: {ranking.rank} - Points: {ranking.points}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rankings;