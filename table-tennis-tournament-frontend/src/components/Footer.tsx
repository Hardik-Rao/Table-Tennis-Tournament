import React from "react";

interface FooterProps {
  navigate: (route: string) => void;
}

const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              🏓 Tournament
            </h3>
            <p className="text-gray-300">
              The premier inter-college table tennis championship featuring top players from across India.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><button onClick={() => navigate("players")} className="hover:text-white transition-colors">Players</button></li>
              <li><button onClick={() => navigate("schedule")} className="hover:text-white transition-colors">Schedule</button></li>
              <li><button onClick={() => navigate("scores")} className="hover:text-white transition-colors">Live Scores</button></li>
              <li><button onClick={() => navigate("leaderboard")} className="hover:text-white transition-colors">Leaderboard</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Tournament Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📅 Duration: Jan 15 - Feb 28, 2023</li>
              <li>🏫 Participating: 8 IIT Colleges</li>
              <li>🏆 Prize Pool: ₹2,00,000</li>
              <li>📍 Venue: IIT Delhi</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📧 info@ttchampionship.in</li>
              <li>📱 +91 98765 43210</li>
              <li>🌐 www.ttchampionship.in</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2023 Table Tennis Championship. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;