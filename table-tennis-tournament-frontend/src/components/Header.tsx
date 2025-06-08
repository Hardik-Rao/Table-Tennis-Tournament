import React, { useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import AdminLoginModal from "./AdminLoginModal"; // Import the modal

const Header: React.FC = () => {
  const [adminModalOpen, setAdminModalOpen] = useState(false); // State to toggle modal

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-2xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Title */}
          <div className="flex items-center">
            <span className="text-4xl mr-4">🏓</span>
            <h1 className="text-3xl font-bold tracking-tight">Table Tennis Championship</h1>
          </div>

          {/* Right: Season + Auth Buttons */}
          <div className="flex items-center space-x-4">
            <div className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold">
              Season 2023
            </div>

            <Link to="/login">
              <Button
                variant="outlined"
                color="inherit"
                sx={{ color: "white", borderColor: "white" }}
              >
                Team Login
              </Button>
            </Link>

            <Link to="/register">
              <Button
                variant="contained"
                color="warning"
                sx={{ fontWeight: "bold" }}
              >
                Register Team
              </Button>
            </Link>

            {/* Admin Login Button */}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setAdminModalOpen(true)}
              sx={{ fontWeight: "bold" }}
            >
              Admin Login
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal open={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </header>
  );
};

export default Header;
