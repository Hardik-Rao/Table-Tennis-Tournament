import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
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
import ManualUpdateSchedule from "./pages/ManulUpdateSchedule";
import { Box, Typography } from "@mui/material";

const PrivateRoute: React.FC = () => {
  const adminSession = localStorage.getItem('adminSession');
  const isAuthenticated = adminSession !== null;
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

const AdminLoginPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(true);
  
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  
  return (
    <Box>
      <Typography variant="h4">Admin Access Required</Typography>
      <Typography>Please log in to manage the tournament dashboard.</Typography>
      <AdminLoginModal open={isModalOpen} onClose={handleModalClose} />
    </Box>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideLayoutOnRoutes = ["/register", "/admin/login", "/admin/dashboard", "/admin/schedule"];
  
  const hideLayout = hideLayoutOnRoutes.includes(location.pathname);
  
  return (
    <div>
      {!hideLayout && <Header />}
      {!hideLayout && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/players" element={<Players />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/scores" element={<Scores />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<PrivateRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="schedule" element={<ManualUpdateSchedule />} />
          
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      {!hideLayout && <Footer navigate={navigate} />}
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