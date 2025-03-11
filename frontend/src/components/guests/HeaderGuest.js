// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import TournamentRules from '../TournamentRules'; // Import TournamentRules component

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff; /* Light background */
  padding: 20px;
  border-bottom: 2px solid #ddd; /* Light border under header */
`;

const TournamentHeading = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50; /* Dark text for heading */
  margin-bottom: 15px;
`;

const HeaderBottom = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftButtons = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 15px;
`;

const RightButton = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const NavButton = styled.button`
  background-color: #4682B4;  /* Light grayish background for buttons */
  border: 1px solid #bdc3c7;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 14px;
  
  &:hover {
    background-color: #dcdfe1; /* Slightly darker gray on hover */
  }

  a {
    color: #2c3e50; /* Dark text color for links */
    text-decoration: none;
  }
`;

const HeaderGuest = () => {
 
  return (
    <div>
      <HeaderContainer>
        <TournamentHeading>Table Tennis Tournament</TournamentHeading>
        <HeaderBottom>
          <LeftButtons>
            <NavButton>
              <Link to="/playersGuest">Players</Link>
            </NavButton>
            <NavButton>
              <Link to="/matchesGuest">Matches</Link>
            </NavButton>
            <NavButton>
              <Link to="/live-scores">Live Scores</Link>
            </NavButton>
          </LeftButtons>
        
        </HeaderBottom>
      </HeaderContainer>
      
      {/* Displaying the TournamentRules Component Below the Header */}
      <TournamentRules />
    </div>
  );
};

export default HeaderGuest;
