import React, { useState, useEffect } from 'react';
import PlayerCard from './PlayerCard';

const PlayerListGuest = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/players');
        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  

  if (loading) {
    return <p>Loading players...</p>;
  }

  return (
    <div className="player-list">
      <h2>Registered Players</h2>
      <div className="cards-container">
        {players.length > 0 ? (
          players.map((player) => (
            <PlayerCard
              key={player.player_id}
              name={player.name}
              institute={player.institute}
              age={player.age}
              points={player.points}
              rank={player.rank}
             
            />
          ))
        ) : (
          <p>No players registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default PlayerListGuest;
