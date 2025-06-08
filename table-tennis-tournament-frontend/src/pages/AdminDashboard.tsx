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
  Divider
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
}

interface Team {
  id: number;
  name: string;
  sport: string;
  captain: {
    name: string;
    email: string;
    avatar?: string;
  };
  players: Player[];
  totalWins: number;
  totalMatches: number;
}

const AdminDashboard: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for teams - replace with actual API call
    const fetchTeams = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockTeams: Team[] = [
          {
            id: 1,
            name: "Thunder Hawks",
            sport: "Table Tennis",
            captain: {
              name: "Mike Rodriguez",
              email: "mike.rodriguez@iit.ac.in",
              avatar: "https://i.pravatar.cc/150?img=3"
            },
            players: [
              {
                id: 1,
                name: "Alex Johnson",
                sport: "Table Tennis",
                year: "3rd",
                avatar: "https://i.pravatar.cc/150?img=1",
                position: "Singles Player",
                wins: 15,
                losses: 3
              },
              {
                id: 2,
                name: "Sarah Chen",
                sport: "Table Tennis",
                year: "2nd",
                avatar: "https://i.pravatar.cc/150?img=2",
                position: "Doubles Specialist",
                wins: 12,
                losses: 2
              }
            ],
            totalWins: 27,
            totalMatches: 32
          },
          {
            id: 2,
            name: "Lightning Bolts",
            sport: "Table Tennis",
            captain: {
              name: "Priya Sharma",
              email: "priya.sharma@iit.ac.in",
              avatar: "https://i.pravatar.cc/150?img=5"
            },
            players: [
              {
                id: 3,
                name: "Rahul Verma",
                sport: "Table Tennis",
                year: "4th",
                avatar: "https://i.pravatar.cc/150?img=6",
                position: "Aggressive Player",
                wins: 18,
                losses: 2
              },
              {
                id: 4,
                name: "Anita Patel", 
                sport: "Table Tennis",
                year: "3rd",
                avatar: "https://i.pravatar.cc/150?img=7",
                position: "Defensive Specialist",
                wins: 14,
                losses: 4
              }
            ],
            totalWins: 32,
            totalMatches: 38
          },
          {
            id: 3,
            name: "Fire Dragons",
            sport: "Badminton",
            captain: {
              name: "Arjun Singh",
              email: "arjun.singh@iit.ac.in",
              avatar: "https://i.pravatar.cc/150?img=8"
            },
            players: [
              {
                id: 5,
                name: "Sneha Gupta",
                sport: "Badminton",
                year: "2nd",
                avatar: "https://i.pravatar.cc/150?img=9",
                position: "Singles Specialist",
                wins: 10,
                losses: 3
              },
              {
                id: 6,
                name: "Karan Mehta",
                sport: "Badminton", 
                year: "4th",
                avatar: "https://i.pravatar.cc/150?img=10",
                position: "Doubles Expert",
                wins: 13,
                losses: 2
              }
            ],
            totalWins: 23,
            totalMatches: 28
          }
        ];
        
        setTeams(mockTeams);
      } catch (error) {
        console.error('Failed to fetch teams:', error);
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

  const totalTeams = teams.length;
  const totalPlayers = teams.reduce((sum, team) => sum + team.players.length, 0);
  const totalMatches = teams.reduce((sum, team) => sum + team.totalMatches, 0);

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
                variant="contained"
                startIcon={<schedule/>}
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
                  {totalTeams}
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
                  {totalPlayers}
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
                  {totalMatches}
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

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <Typography>Loading teams...</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {teams.map((team) => (
                <Grid item xs={12} key={team.id}>
                  <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.1)' }}>
                    <CardContent>
                      {/* Team Header */}
                      <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
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
                              Win Rate: {((team.totalWins / team.totalMatches) * 100).toFixed(0)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {team.players.length} Players
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
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              Captain: {team.captain.name}
                            </Typography>
                            <Typography variant="body2">
                              {team.captain.email}
                            </Typography>
                          </Box>
                        </Box>
                      </Alert>

                      {/* Expandable Players List */}
                      <Collapse in={expandedTeam === team.id}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                          Team Players
                        </Typography>
                        
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Player</TableCell>
                                <TableCell>Position</TableCell>
                                <TableCell>Year</TableCell>
                                <TableCell align="center">W-L</TableCell>
                                <TableCell align="center">Win Rate</TableCell>
                                <TableCell align="center">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {team.players.map((player) => {
                                const winRate = ((player.wins / (player.wins + player.losses)) * 100).toFixed(0);
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
                                    <TableCell>{player.position}</TableCell>
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