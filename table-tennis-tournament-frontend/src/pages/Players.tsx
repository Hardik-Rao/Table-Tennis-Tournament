import React, { useState, useEffect } from "react";
import PlayerCard from "../components/PlayerCard";
import {
   Container,
   Typography,
   Grid,
   Box,
   Paper,
   CircularProgress,
   Alert
} from "@mui/material";
import { People } from "@mui/icons-material";

// Define interfaces for type safety
interface ApiPlayer {
  name: string;
  team: string;
  avatar?: string;
  style: string;
  grip: string;
  rubber: string;
}

interface TransformedPlayer {
  id: number;
  name: string;
  team: string;
  avatar: string;
  style: string;
  grip: string;
  rubber: string;
}

const Players: React.FC = () => {
  const [players, setPlayers] = useState<TransformedPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/players');
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const data: ApiPlayer[] = await response.json();
        console.log('Fetched players:', data); // For debugging
        
        // Transform API response to match PlayerCard props
        const transformedPlayers: TransformedPlayer[] = data.map((player: ApiPlayer, index: number) => ({
          id: index + 1, // Since your API doesn't return player_id
          name: player.name,
          team: player.team,
          avatar: player.avatar || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
          style: player.style,
          grip: player.grip,
          rubber: player.rubber
        }));
        
        setPlayers(transformedPlayers);
        setError(null);
      } catch (err) {
        console.error('Error fetching players:', err);
        // Handle error with proper type checking
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch players');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}
        >
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading players...
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Container maxWidth="md">
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 3,
              fontSize: '1.1rem'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Failed to load players
            </Typography>
            <Typography variant="body1">
              {error}
            </Typography>
          </Alert>
        </Container>
      </Box>
    );
  }

  // No players found
  if (players.length === 0) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}>
        <Container maxWidth="xl">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}
          >
            <People sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              No Players Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              There are currently no registered players in the tournament.
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Main render with players
  return (
    <Box sx={{
       minHeight: '100vh',
      maxHeight: '100vh',
      overflow: 'auto',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl" sx={{ height: 'fit-content' }}>
        {/* Header Section */}
        <Paper
           elevation={3}
          sx={{
             p: 3,
             mb: 4,
             borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}
        >
          <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2}>
            <People sx={{ fontSize: 48, color: 'primary.main' }} />
          </Box>
          <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
            Meet the Players
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Discover talented athletes from top institutions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {players.length} registered players
          </Typography>
        </Paper>

        {/* Players Grid */}
        <Paper
           elevation={3}
          sx={{
             p: 3,
             borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            maxHeight: 'calc(100vh - 250px)',
            overflow: 'auto'
          }}
        >
          <Grid container spacing={3}>
            {players.map((player: TransformedPlayer) => (
              <Grid item xs={12} sm={6} lg={4} xl={3} key={player.id}>
                <PlayerCard {...player} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Players;