import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { route: "/", label: "🏠 Home" },
    { route: "/players", label: "🏓 Players" },
    { route: "/schedule", label: "📅 Schedule" },
    { route: "/scores", label: "📊 Live Scores" },
    { route: "/leaderboard", label: "🏆 Leaderboard" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-center space-x-1 py-4">
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                location.pathname === item.route
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
