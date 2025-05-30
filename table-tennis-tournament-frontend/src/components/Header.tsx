import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-2xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-4xl mr-4">🏓</span>
            <h1 className="text-3xl font-bold tracking-tight">Table Tennis Championship</h1>
          </div>
          <div className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold">
            Season 2023
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;