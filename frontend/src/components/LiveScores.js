import React, { useState, useEffect } from 'react';

const LiveScores = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetch('/api/live-scores')
      .then((response) => response.json())
      .then((data) => setScores(data))
      .catch((error) => console.error('Error fetching live scores:', error));
  }, []);

  return (
    <div className="live-scores">
      <h2>Live Scores</h2>
      <ul>
        {scores.map((score) => (
          <li key={score.score_id}>
            {score.player} - Points: {score.points}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LiveScores;