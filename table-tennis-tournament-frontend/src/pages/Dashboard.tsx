// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import PlayerCard from "../components/PlayerCard";
import { 
  Typography, 
  Grid, 
  Button, 
  CircularProgress, 
  Container,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  Paper
} from "@mui/material";
import { 
  SportsTennis, 
  People, 
  EmojiEvents,
  Logout as LogoutIcon 
} from "@mui/icons-material";

const Dashboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [captain, setCaptain] = useState(null);

  useEffect(() => {
    // Mock: Get captain data from localStorage
    const session = localStorage.getItem("userSession");
    if (session) {
      const user = JSON.parse(session);
      setCaptain(user);
    }

    // Replace this with real API call to fetch players of the logged-in captain
    const fetchPlayers = async () => {
      try {
        // Simulate API delay
        await new Promise((res) => setTimeout(res, 1000));

        // Enhanced mock player data
        const dummyPlayers = [
  { 
    id: 1, 
    name: "Alex Johnson", 
    team: "Thunder Hawks",
    avatar: "https://i.pravatar.cc/150?img=1",
    style: "Aggressive",
    grip: "Shakehand",
    rubber: "Butterfly Tenergy 05"
  },
  { 
    id: 2, 
    name: "Sarah Chen", 
    team: "Thunder Hawks", 
    avatar: "https://i.pravatar.cc/150?img=2",
    style: "Defensive",
    grip: "Penhold",
    rubber: "Yasaka Mark V"
  },
  { 
    id: 3, 
    name: "Mike Rodriguez", 
    team: "Thunder Hawks", 
    avatar: "https://i.pravatar.cc/150?img=3",
    style: "All-Round",
    grip: "Shakehand",
    rubber: "Donic Bluefire M1"
  },
  { 
    id: 4, 
    name: "Emma Thompson", 
    team: "Thunder Hawks", 
    avatar: "https://i.pravatar.cc/150?img=4",
    style: "Looping",
    grip: "Penhold",
    rubber: "Stiga Mantra M"
  }
];


        setPlayers(dummyPlayers);
      } catch (err) {
        console.error("Failed to fetch players", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    window.location.href = "/login";
  };

  const totalWins = players.reduce((sum, player) => sum + (player.wins || 0), 0);
  const totalMatches = players.reduce((sum, player) => sum + (player.wins || 0) + (player.losses || 0), 0);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: '#667eea', width: 56, height: 56 }}>
                <EmojiEvents fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  Captain Dashboard
                </Typography>
                {captain && (
                  <Typography variant="subtitle1" color="text.secondary">
                    Welcome back, {captain.email}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff5252, #ff7979)',
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Paper>

        {/* Stats Section */}
        {!loading && players.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <People fontSize="large" sx={{ mb: 1 }} />
                  <Typography variant="h3" fontWeight="bold">
                    {players.length}
                  </Typography>
                  <Typography variant="h6">
                    Total Players
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <EmojiEvents fontSize="large" sx={{ mb: 1 }} />
                  <Typography variant="h3" fontWeight="bold">
                    {totalWins}
                  </Typography>
                  <Typography variant="h6">
                    Total Wins
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SportsTennis fontSize="large" sx={{ mb: 1 }} />
                  <Typography variant="h3" fontWeight="bold">
                    {totalMatches}
                  </Typography>
                  <Typography variant="h6">
                    Total Matches
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Players Section */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 3, 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <People color="primary" />
            Team Players
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : players.length === 0 ? (
            <Box textAlign="center" py={8}>
              <People fontSize="large" color="disabled" sx={{ mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No players registered yet.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start building your team by adding players!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {players.map((player) => (
                <Grid item xs={12} sm={6} lg={4} xl={3} key={player.id}>
                  <PlayerCard {...player} />
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;