import React from "react";
import PlayerCard from "../components/PlayerCard";

const samplePlayers = [
  {
    name: "Hardik Mehta",
    team: "IIT Kanpur",
    age: 22,
    stats: ["5 Wins", "Top Spin Specialist", "Avg Rally: 8"],
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    name: "Aman Sharma",
    team: "IIT Delhi",
    age: 21,
    stats: ["3 Wins", "Backhand Master", "Fast Serve"],
    image: "https://randomuser.me/api/portraits/men/51.jpg",
  },
  {
    name: "Rahul Verma",
    team: "IIT Bombay",
    age: 23,
    stats: ["7 Wins", "Aggressive Style", "Spin Attack"],
    image: "https://randomuser.me/api/portraits/men/41.jpg",
  },
];

const Players: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Meet the Players</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {samplePlayers.map((player, index) => (
          <PlayerCard key={index} {...player} />
        ))}
      </div>
    </div>
  );
};

export default Players;
