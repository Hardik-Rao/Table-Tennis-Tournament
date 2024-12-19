// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PlayerList from './components/PlayerList';
import MatchList from './components/MatchList';
import LiveScores from './components/LiveScores';
import MealTracking from './components/MealTracking';

import Rankings from './components/Rankings';
import LoginPage from './components/LoginPage'; 
import './style/App.css';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<PlayerList />} />
        <Route path="/matches" element={<MatchList />} />
        <Route path="/live-scores" element={<LiveScores />} />
        <Route path="/meal-tracking" element={<MealTracking />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/login" element={<LoginPage />} /> {/* Add this route for login */}
      </Routes>
    </div>
  );
}

export default App;
