import React from 'react';
import '../style/MatchCard.css';

const MatchCard = ({ match }) => {
    const { player1_name, player2_name, player1_score, player2_score, match_date, status, venue } = match;

    // Convert the match_date to IST
    const matchDate = new Date(match_date);
    const IST_OFFSET = 330; // IST offset in minutes (UTC+5:30)
    const matchDateIST = new Date(matchDate.getTime() + IST_OFFSET * 60 * 1000);

    return (
        <div className="match-card">
            <div className="match-header">
                <h3>{player1_name} vs {player2_name}</h3>
            </div>
            <div className="match-details">
                <p><strong>Date:</strong> {matchDateIST.toLocaleDateString()}</p>
                <p><strong>Time:</strong> {matchDateIST.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST</p>
                <p><strong>Venue:</strong> {venue}</p>
                <p><strong>Status:</strong> {status}</p>
               {/*<p><strong>Score:</strong> {player1_score} - {player2_score}</p>*/}
            </div>
        </div>
    );
};

export default MatchCard;


