// src/pages/Dashboard.tsx
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
  Paper,
  Alert
} from "@mui/material";
import { 
  SportsTennis, 
  People, 
  EmojiEvents,
  Logout as LogoutIcon 
} from "@mui/icons-material";

// Type definitions
interface Player {
  id: number;
  name: string;
  team: string;
  avatar: string;
  style: string;
  grip: string;
  rubber: string;
  rollNumber: string;
  branch: string;
  year: string;
  phone: string;
  sport: string;
  position: string;
  wins?: number;
  losses?: number;
}

interface TeamData {
  team_name: string;
  captain_name: string;
  primary_sport?: string;
  players: {
    player_id: number;
    player_name: string;
    avatar_url?: string;
    playing_style: string;
    grip_style: string;
    rubber_type: string;
    roll_number: string;
    branch: string;
    year: string;
    phone_number: string;
    sport: string;
    player_position: string;
  }[];
}



const Dashboard = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get captain data from localStorage
    const session = localStorage.getItem("userSession");
    if (session) {
      try {
        JSON.parse(session);
      } catch (err) {
        console.error("Error parsing user session:", err);
        handleLogout();
        return;
      }
    } else {
      // No session found, redirect to login
      handleLogout();
      return;
    }

    // Fetch team profile data including players
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          console.error("No authentication token found");
          throw new Error("No authentication token found");
        }
        
        console.log("Fetching team data with token:", token.substring(0, 20) + "...");

        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            throw new Error("Session expired");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);
        
        if (result.success && result.data && result.data.team) {
          const team: TeamData = result.data.team;
          setTeamData(team);
          
          // Format players data to match your PlayerCard component expectations
          const formattedPlayers: Player[] = team.players.map((player) => ({
            id: player.player_id,
            name: player.player_name,
            team: team.team_name,
            avatar: player.avatar_url || `https://i.pravatar.cc/150?u=${player.player_id}`,
            style: player.playing_style,
            grip: player.grip_style,
            rubber: player.rubber_type,
            // Additional fields that might be useful
            rollNumber: player.roll_number,
            branch: player.branch,
            year: player.year,
            phone: player.phone_number,
            sport: player.sport,
            position: player.player_position
          }));
          
          setPlayers(formattedPlayers);
        } else {
          throw new Error(result.message || "Failed to fetch team data");
        }
      } catch (error) {
        console.error("Failed to fetch team data:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        setError(errorMessage);
        
        // If authentication error, logout user
        if (error instanceof Error && (error.message.includes("Session expired") || error.message.includes("authentication"))) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  // Calculate stats from actual player data
  const totalWins = players.reduce((sum, player) => sum + (player.wins || 0), 0);
  const totalLosses = players.reduce((sum, player) => sum + (player.losses || 0), 0);
  const totalMatches = totalWins + totalLosses;

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
                {teamData && (
                  <>
                    <Typography variant="h6" color="text.primary">
                      {teamData.team_name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Welcome back, {teamData.captain_name}
                    </Typography>
                  </>
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

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

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
            {teamData && (
              <Chip 
                label={teamData.primary_sport || 'Table Tennis'} 
                color="primary" 
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : error ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                Failed to load team data
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {error}
              </Typography>
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