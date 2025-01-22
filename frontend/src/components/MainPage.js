import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const styles = {
    mainPage: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f6f8',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '20px',
    },
    mainHeader: {
      width: '100%',
      maxWidth: '800px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '8px 8px 0 0',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    tournamentTitle: {
      fontSize: '24px',
      color: '#2c3e50',
      margin: '0',
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
    },
    dashboardButton: {
      padding: '10px 20px',
      backgroundColor: '#2980b9',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    dashboardButtonHover: {
      backgroundColor: '#3498db',
    },
    separatorLine: {
      width: '100%',
      maxWidth: '800px',
      height: '2px',
      backgroundColor: '#ddd',
    },
    rulesContainer: {
      width: '100%',
      maxWidth: '800px',
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '0 0 8px 8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    rulesHeading: {
      fontSize: '20px',
      color: '#34495e',
      marginBottom: '10px',
    },
    ruleList: {
      margin: '0',
      padding: '0',
      listStyleType: 'none',
      color: '#34495e',
      fontSize: '16px',
    },
    ruleItem: {
      marginBottom: '8px',
    },
  };

  return (
    <div style={styles.mainPage}>
      <header style={styles.mainHeader}>
        <h1 style={styles.tournamentTitle}>Table Tennis Tournament</h1>
        <div style={styles.buttonContainer}>
          <button
            style={styles.dashboardButton}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = styles.dashboardButtonHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = styles.dashboardButton.backgroundColor)
            }
            onClick={() => navigate('/registerAdmin')}
          >
            Admin Dashboard
          </button>
          <button
            style={styles.dashboardButton}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = styles.dashboardButtonHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = styles.dashboardButton.backgroundColor)
            }
          >
            Guest Dashboard
          </button>
        </div>
      </header>
      <div style={styles.separatorLine}></div>
      <div style={styles.rulesContainer}>
        <h2 style={styles.rulesHeading}>Tournament Rules</h2>
        <ul style={styles.ruleList}>
          <li style={styles.ruleItem}>Matches will be played in a best-of-five format.</li>
          <li style={styles.ruleItem}>Each game is played to 11 points, with at least a 2-point lead to win.</li>
          <li style={styles.ruleItem}>Players must arrive 10 minutes before their scheduled match time.</li>
          <li style={styles.ruleItem}>Any player not present at the start of the match will forfeit.</li>
          <li style={styles.ruleItem}>Fair play and sportsmanship are mandatory at all times.</li>
        </ul>
      </div>
    </div>
  );
};

export default MainPage;
