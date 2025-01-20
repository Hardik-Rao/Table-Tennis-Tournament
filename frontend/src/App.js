import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import PlayerList from './components/PlayerList';
import MatchList from './components/MatchList';
import LiveScores from './components/LiveScores';
import Rankings from './components/Rankings';
import Add from './components/Add';
const App = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <div>
      <Routes>
        <Route path="/" element={<RegistrationForm setIsRegistered={setIsRegistered} />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<Header />} />
        <Route path="/players" element={<PlayerList />} />
        <Route path="/matches" element={<MatchList />} />
        <Route path="/live-scores" element={<LiveScores />} />
        <Route path="/rankings" element={<Rankings/>} />
        <Route path="/add" element={<Add/>} />
      </Routes>
    </div>
  );
};

export default App;
