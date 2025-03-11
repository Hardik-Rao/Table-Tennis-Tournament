import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 600px; /* Ensure the card doesn't get too wide */
  margin: 0 auto;
`;

const MatchHeader = styled.div`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
`;

const MatchDetails = styled.div`
  color: #555;
  font-size: 16px;
  line-height: 1.5;
`;

const MatchCard = ({ match }) => {
  const { player1_name, player2_name, player1_score, player2_score, match_date, status, venue } = match;

  const matchDate = new Date(match_date);
  const IST_OFFSET = 330; // IST offset in minutes (UTC+5:30)
  const matchDateIST = new Date(matchDate.getTime() + IST_OFFSET * 60 * 1000);

  return (
    <Card>
      <MatchHeader>
        {player1_name} vs {player2_name}
      </MatchHeader>
      <MatchDetails>
        <p><strong>Date:</strong> {matchDateIST.toLocaleDateString()}</p>
        <p><strong>Time:</strong> {matchDateIST.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST</p>
        <p><strong>Venue:</strong> {venue}</p>
        <p><strong>Status:</strong> {status}</p>
      </MatchDetails>
    </Card>
  );
};

export default MatchCard;