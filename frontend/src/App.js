import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeaderGuest from './components/guests/HeaderGuest';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import PlayerList from './components/PlayerList';
import PlayerListGuest from './components/guests/PlayerList';
import MatchList from './components/MatchList';
import MatchListGuest from './components/guests/MatchListGuest';
import LiveScores from './components/LiveScores';
import Rankings from './components/Rankings';
import Add from './components/Add';
import MainPage from './components/MainPage';
import RegistrationFormGuest from './components/guests/RegistrationFormGuest';
const App = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <div>
      <Routes>
      <Route path="/" element={<MainPage />} />
        <Route path="/registeradmin" element={<RegistrationForm setIsRegistered={setIsRegistered} />} />
        <Route path="/registerguest" element={<RegistrationFormGuest setIsRegistered={setIsRegistered}/>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<Header />} />
        <Route path="/homeGuest" element={<HeaderGuest />} />
        <Route path="/players" element={<PlayerList />} />
        <Route path="/matches" element={<MatchList />} />
        <Route path="/playersGuest" element={<PlayerListGuest />} />
        <Route path="/matchesGuest" element={<MatchListGuest />} />
        <Route path="/live-scores" element={<LiveScores />} />
        <Route path="/rankings" element={<Rankings/>} />
        <Route path="/add" element={<Add/>} />
      </Routes>
    </div>
  );
};

export default App;
