import React from "react";

interface PlayerCardProps {
  name: string;
  team: string;
  age: number;
  stats: string[];
  image?: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ name, team, age, stats, image }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 max-w-sm mx-auto">
      <img
        src={image || "https://via.placeholder.com/300x200"}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
        <p className="text-sm text-blue-600 font-medium mb-1">Team: {team}</p>
        <p className="text-sm text-gray-500 mb-3">Age: {age}</p>
        <div className="bg-gray-100 p-3 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Stats:</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {stats.map((stat, index) => (
              <li key={index}>{stat}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
