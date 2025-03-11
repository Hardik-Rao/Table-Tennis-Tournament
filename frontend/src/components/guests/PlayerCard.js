import React from 'react';
import styled from 'styled-components';

const defaultImage = '../style/default-placeholder.png';

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 280px;
  padding: 20px;
  margin: 15px;
  display: inline-block;
  text-align: center;
  transition: transform 0.3s ease;
  overflow: hidden;
  border: 1px solid #ddd;

  &:hover {
    transform: scale(1.05);
  }
`;

const CardImage = styled.div`
  background-color: #f4f4f9;
  height: 180px;
  margin-bottom: 20px;
  border-radius: 4px;
`;

const CardContent = styled.div`
  padding: 10px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 10px;
`;

const CardText = styled.p`
  font-size: 14px;
  color: #7f8c8d;
  margin: 5px 0;
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 15px;

  &:hover {
    background-color: #c0392b;
  }
`;

const PlayerCard = ({ name, institute, age, points, rank }) => {
  return (
    <Card>
      <CardImage src={defaultImage} />
      <CardContent>
        <CardTitle>{name}</CardTitle>
        <CardText>Institute: {institute || 'Independent'}</CardText>
        <CardText>Age: {age}</CardText>
        <CardText>Points: {points}</CardText>
        <CardText>Rank: {rank}</CardText>
        
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
