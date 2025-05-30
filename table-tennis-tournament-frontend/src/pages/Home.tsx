import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
        {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Inter-IIT Table Tennis Championship 2023
        </h1>
        <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
          Witness the ultimate showdown as the finest table tennis players from India's premier institutes compete for glory, pride, and the coveted championship title.
        </p>
        
        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button
            onClick={() => navigate("players")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            View Players 🏓
          </button>
          <button
            onClick={() => navigate("schedule")}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Match Schedule 📅
          </button>
          <button
            onClick={() => navigate("scores")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Live Scores 📊
          </button>
          <button
            onClick={() => navigate("leaderboard")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Leaderboard 🏆
          </button>
        </div>
      </section>

      {/* Tournament Info */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Tournament Information</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Duration</h3>
            <p className="text-gray-600">January 15 - February 28, 2023</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🏫</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Participating Colleges</h3>
            <p className="text-gray-600">8 Premier IIT Institutes</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Prize Pool</h3>
            <p className="text-gray-600">₹2,00,000 Total Prizes</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Venue</h3>
            <p className="text-gray-600">IIT Delhi Sports Complex</p>
          </div>
        </div>
      </section>

      {/* Tournament Rules */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Tournament Rules & Format</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-blue-600">📋 General Rules</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>Matches follow official ITTF rules</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>Best of 5 sets format (first to win 3 sets)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>Each set played to 11 points (win by 2)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>Service alternates every 2 points</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>30-second timeout per set allowed</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-green-600">🏆 Tournament Format</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">•</span>
                <span>Round Robin group stage (2 groups of 4 teams)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">•</span>
                <span>Top 2 from each group advance to semifinals</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">•</span>
                <span>Single elimination semifinals and finals</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">•</span>
                <span>3rd place playoff match</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">•</span>
                <span>Awards ceremony after final match</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Participating Teams */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Participating Teams</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-blue-600 mb-2">IIT Kanpur</h3>
            <p className="text-gray-600">Defending Champions</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-blue-600 mb-2">IIT Bombay</h3>
            <p className="text-gray-600">2022 Runners-up</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-blue-600 mb-2">IIT Delhi</h3>
            <p className="text-gray-600">Host Institute</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-blue-600 mb-2">IIT Madras</h3>
            <p className="text-gray-600">Strong Contender</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-blue-600 mb-2">IIT Kharagpur</h3>
            <p className="text-gray-600">Rising Team</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-blue-600 mb-2">IIT Roorkee</h3>
            <p className="text-gray-600">Dark Horse</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-blue-600 mb-2">IIT Guwahati</h3>
            <p className="text-gray-600">Determined Team</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-blue-600 mb-2">IIT Hyderabad</h3>
            <p className="text-gray-600">Emerging Force</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
