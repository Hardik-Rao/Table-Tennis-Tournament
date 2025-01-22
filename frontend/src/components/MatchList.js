import React, { useState, useEffect } from 'react';
import MatchCard from './MatchCard';
import styled from 'styled-components';

const MatchListContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #2c3e50;
`;

const MatchCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InfoMessage = styled.p`
  text-align: center;
  color: #7f8c8d;
`;

const AddButton = styled.button`
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

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
    <MatchListContainer>
      <Heading>Upcoming Matches</Heading>
      {matches.length === 0 ? (
        <InfoMessage>No matches found. Please try again later.</InfoMessage>
      ) : (
        <MatchCardContainer>
          {matches.map((match) => (
            <MatchCard key={match.match_id} match={match} />
          ))}
        </MatchCardContainer>
      )}
      <AddButton onClick={generateMatches}>Add Matches of New Arrivals</AddButton>
    </MatchListContainer>
  );
};

export default MatchList;
