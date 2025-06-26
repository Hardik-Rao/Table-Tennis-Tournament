// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Button,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Alert,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  AdminPanelSettings,
  Groups,
  Person,
  Schedule,
  ExpandMore,
  ExpandLess,
  Edit,
  Visibility,
  EmojiEvents,
  SportsTennis,
  CalendarToday,
  Logout as LogoutIcon
} from '@mui/icons-material';

interface Player {
  id: number;
  name: string;
  sport: string;
  year: string;
  avatar?: string;
  position?: string;
  wins: number;
  losses: number;
  roll_number: string;
  branch: string;
  phone: string;
  grip?: string;
  rubber?: string;
}

interface Captain {
  name: string;
  email: string;
  avatar?: string;
  roll_number: string;
  branch: string;
  year: string;
  phone: string;
}

interface Team {
  id: number;
  name: string;
  sport: string;
  captain: Captain;
  players: Player[];
  totalWins: number;
  totalMatches: number;
  playerCount: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    teams: Team[];
    totalTeams: number;
    totalPlayers: number;
    totalMatches: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalPlayers: 0,
    totalMatches: 0
  });

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:5000/api/teams');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.success) {
          setTeams(data.data.teams);
          setStats({
            totalTeams: data.data.totalTeams,
            totalPlayers: data.data.totalPlayers,
            totalMatches: data.data.totalMatches
          });
        } else {
          throw new Error('Failed to fetch teams data');
        }
        
      } catch (error) {
        console.error('Failed to fetch teams:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleExpandTeam = (teamId: number) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  const handleUpdateSchedule = () => {
    // Navigate to schedule update page
    window.location.href = '/admin/schedule';
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    window.location.href = '/';
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6">Loading teams data...</Typography>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, maxWidth: 500 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6">Error Loading Data</Typography>
            <Typography>{error}</Typography>
          </Alert>
          <Button variant="contained" onClick={handleRefresh}>
            Try Again
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      maxHeight: '100vh',
      overflow: 'auto',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
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
              <Avatar sx={{ bgcolor: '#1e3c72', width: 56, height: 56 }}>
                <AdminPanelSettings fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  Admin Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Manage teams, players and schedules
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={handleRefresh}
                sx={{ borderRadius: 3, px: 3, py: 1.5 }}
              >
                Refresh Data
              </Button>
              
              <Button
                variant="contained"
                startIcon={<Schedule/>}
                onClick={handleUpdateSchedule}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #388e3c, #4caf50)',
                  }
                }}
              >
                Update Schedule
              </Button>
              
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
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Groups fontSize="large" sx={{ mb: 1 }} />
                <Typography variant="h3" fontWeight="bold">
                  {stats.totalTeams}
                </Typography>
                <Typography variant="h6">
                  Total Teams
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
              color: '#8b4513',
              borderRadius: 3
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Person fontSize="large" sx={{ mb: 1 }} />
                <Typography variant="h3" fontWeight="bold">
                  {stats.totalPlayers}
                </Typography>
                <Typography variant="h6">
                  Total Players
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              color: '#2c5530',
              borderRadius: 3
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <EmojiEvents fontSize="large" sx={{ mb: 1 }} />
                <Typography variant="h3" fontWeight="bold">
                  {stats.totalMatches}
                </Typography>
                <Typography variant="h6">
                  Total Matches
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Teams Section */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            maxHeight: 'calc(100vh - 350px)',
            overflow: 'auto'
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Groups color="primary" />
            Teams Overview
          </Typography>

          {teams.length === 0 ? (
            <Box display="flex" justifyContent="center" py={8}>
              <Alert severity="info">
                <Typography variant="h6">No Teams Found</Typography>
                <Typography>No teams have been registered yet. Teams will appear here once they register.</Typography>
              </Alert>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {teams.map((team) => (
                <Grid item xs={12} key={team.id}>
                  <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.1)' }}>
                    <CardContent>
                      {/* Team Header */}
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={2} flex={1}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                            <SportsTennis />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {team.name}
                            </Typography>
                            <Chip 
                              label={team.sport} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </Box>
                        </Box>

                        <Box display="flex" alignItems="center" gap={2}>
                          <Box textAlign="right">
                            <Typography variant="body2" color="text.secondary">
                              Win Rate: {team.totalMatches > 0 ? ((team.totalWins / team.totalMatches) * 100).toFixed(0) : 0}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {team.playerCount} Players
                            </Typography>
                          </Box>
                          
                          <IconButton 
                            onClick={() => handleExpandTeam(team.id)}
                            sx={{ ml: 1 }}
                          >
                            {expandedTeam === team.id ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Captain Info */}
                      <Alert 
                        severity="info" 
                        sx={{ mb: 2, '& .MuiAlert-message': { width: '100%' } }}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar 
                            src={team.captain.avatar} 
                            sx={{ width: 32, height: 32 }}
                          >
                            {team.captain.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="body2" fontWeight="bold">
                              Captain: {team.captain.name}
                            </Typography>
                            <Typography variant="body2">
                              {team.captain.email} • {team.captain.roll_number} • {team.captain.year} Year
                            </Typography>
                          </Box>
                        </Box>
                      </Alert>

                      {/* Expandable Players List */}
                      <Collapse in={expandedTeam === team.id}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                          Team Players ({team.playerCount})
                        </Typography>
                        
                        {team.players.length === 0 ? (
                          <Alert severity="warning">
                            This team has no players registered yet.
                          </Alert>
                        ) : (
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Player</TableCell>
                                  <TableCell>Roll Number</TableCell>
                                  <TableCell>Branch</TableCell>
                                  <TableCell>Year</TableCell>
                                  <TableCell align="center">W-L</TableCell>
                                  <TableCell align="center">Win Rate</TableCell>
                                  <TableCell align="center">Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {team.players.map((player) => {
                                  const totalGames = player.wins + player.losses;
                                  const winRate = totalGames > 0 ? ((player.wins / totalGames) * 100).toFixed(0) : '0';
                                  return (
                                    <TableRow key={player.id}>
                                      <TableCell>
                                        <Box display="flex" alignItems="center" gap={2}>
                                          <Avatar 
                                            src={player.avatar} 
                                            sx={{ width: 32, height: 32 }}
                                          >
                                            {player.name.split(' ').map(n => n[0]).join('')}
                                          </Avatar>
                                          {player.name}
                                        </Box>
                                      </TableCell>
                                      <TableCell>{player.roll_number}</TableCell>
                                      <TableCell>{player.branch}</TableCell>
                                      <TableCell>
                                        <Chip label={`${player.year} Year`} size="small" />
                                      </TableCell>
                                      <TableCell align="center">
                                        {player.wins}-{player.losses}
                                      </TableCell>
                                      <TableCell align="center">
                                        <Chip 
                                          label={`${winRate}%`}
                                          size="small"
                                          color={parseInt(winRate) >= 80 ? 'success' : parseInt(winRate) >= 60 ? 'warning' : 'error'}
                                        />
                                      </TableCell>
                                      <TableCell align="center">
                                        <Tooltip title="View Details">
                                          <IconButton size="small">
                                            <Visibility fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Player">
                                          <IconButton size="small">
                                            <Edit fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      </Collapse>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;