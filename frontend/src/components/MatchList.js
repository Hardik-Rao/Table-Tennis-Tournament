// src/components/MatchList.js
import React, { useState, useEffect } from 'react';
import MatchCard from './MatchCard';
import '../style/MatchList.css';

const MatchList = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMatches = async () => {
        try {
            const response = await fetch('/api/matches');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setMatches(data);
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    const handleMatchButtonClick = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/trigger-match', {
                method: 'POST',
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message || 'Matches generated successfully!');
                await fetchMatches(); // Refresh the match list after creation
            } else {
                alert(result.error || 'Failed to create matches.');
            }
        } catch (error) {
            console.error('Error triggering match:', error);
            alert('An error occurred while generating matches.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    return (
        <div className="match-list">
            <h2>Upcoming Matches</h2>
            <button 
                onClick={handleMatchButtonClick} 
                disabled={loading} 
                className="trigger-match-button"
            >
                {loading ? 'Generating...' : 'Match'}
            </button>
            {matches.length === 0 ? (
                <p>No matches found or insufficient teams registered. Please try again later.</p>
            ) : (
                matches.map((match) => (
                    <MatchCard key={match.match_id} match={match} />
                ))
            )}
        </div>
    );
};

export default MatchList;
