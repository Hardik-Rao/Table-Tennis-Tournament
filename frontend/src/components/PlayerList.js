import React, { useState, useEffect } from 'react';
import PlayerCardAdmin from './PlayerCardAdmin';

const PlayerList = () => {
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

  const handleDelete = async (name) => {
    try {
      const response = await fetch(`http://localhost:5000/api/players?name=${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete player');
      }

      alert(`Player "${name}" deleted successfully.`);
      setPlayers((prevPlayers) => prevPlayers.filter((player) => player.name !== name));
    } catch (error) {
      console.error('Error deleting player:', error);
      alert(`Failed to delete player "${name}": ${error.message}`);
    }
  };

  if (loading) {
    return <p>Loading players...</p>;
  }

  return (
    <div className="player-list">
      <h2>Registered Players</h2>
      <div className="cards-container">
        {players.length > 0 ? (
          players.map((player) => (
            <PlayerCardAdmin
              key={player.player_id}
              name={player.name}
              institute={player.institute}
              age={player.age}
              points={player.points}
              rank={player.rank}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p>No players registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default PlayerList;
