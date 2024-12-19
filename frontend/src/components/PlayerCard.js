import React from 'react';
import '../style/PlayerCard.css'; // Importing the CSS file

const PlayerCard = ({ name, institute, age, points, rank, img }) => {
  const imageUrl = img ? `http://localhost:5000/uploads/${img}` : '/default-image.png';

  return (
    <div className="card">
      <div className="card-image">
        <img src={imageUrl} alt={`${name}'s avatar`} />
      </div>
      <div className="card-content">
        <h3>{name}</h3>
        <p>Institute: {institute ? institute : 'Independent '}</p>
        <p>Age: {age}</p>
        <p>Points: {points}</p>
        <p>Rank: {rank}</p>
      </div>
    </div>
  );
};

export default PlayerCard;

