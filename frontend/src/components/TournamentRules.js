import React from 'react';
import styled from 'styled-components';

const RulesSection = styled.div`
  margin-top: 40px;
  background-color: #ecf0f1;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  box-sizing: border-box;
  font-size: 14px;
  color: #34495e;

  h3 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  ul {
    list-style-type: disc;
    margin-left: 20px;
  }
`;

const TournamentRules = () => {
  return (
    <RulesSection>
      <h3>Tournament Rules</h3>
      <ul>
        <li>All players must register before the tournament starts.</li>
        <li>Each match will be best of 3 sets.</li>
        <li>Players must arrive 15 minutes before their match time.</li>
        <li>In case of a tie, a deciding set will be played.</li>
        <li>Respect the decisions of the referees.</li>
      </ul>
    </RulesSection>
  );
};

export default TournamentRules;
