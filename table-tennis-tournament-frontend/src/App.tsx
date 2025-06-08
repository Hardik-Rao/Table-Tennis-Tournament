import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Players from "./pages/Players";
import Schedule from "./pages/Schedule";
import Scores from "./pages/LiveScores";
import Leaderboard from "./pages/LeaderBoard";
import AdminLoginModal from "./components/AdminLoginModal";
import AdminDashboard from "./pages/AdminDashboard";
import { Box, Typography } from "@mui/material";

const PrivateRoute: React.FC = () => {
  const adminSession = localStorage.getItem('adminSession');
  const isAuthenticated = adminSession !== null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

const AdminLoginPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(true);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      color: 'white',
      textAlign: 'center',
      p: 3
    }}>
      <Typography variant="h4" mb={2}>Admin Access Required</Typography>
      <Typography variant="body1">Please log in to manage the tournament dashboard.</Typography>
      <AdminLoginModal open={isModalOpen} onClose={handleModalClose} />
    </Box>
  );
};


const AppContent: React.FC = () => {
  const location = useLocation();
  const hideLayoutOnRoutes = ["/register", "/admin/login", "/admin/dashboard"];

  const hideLayout = hideLayoutOnRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {!hideLayout && <Header />}
      {!hideLayout && <Navbar />}

      <main className={`${hideLayout ? "p-0" : "container mx-auto px-6 py-12"}`}>
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/players" element={<Players />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route path="/admin" element={<PrivateRoute />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;