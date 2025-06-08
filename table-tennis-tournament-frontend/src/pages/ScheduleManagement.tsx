// src/pages/ScheduleManagement.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack,
  CalendarToday,
  SportsTennis,
  Groups,
  AccessTime,
  LocationOn,
  Save as SaveIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface Match {
  id: number;
  team1: string;
  team2: string;
  sport: string;
  dateTime: Date;
  venue: string;
  status: 'scheduled' | 'ongoing' | 'completed';
  result?: string;
}

const ScheduleManagement: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    sport: '',
    dateTime: new Date(),
    venue: ''
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const teams = ['Thunder Hawks', 'Lightning Bolts', 'Fire Dragons', 'Storm Eagles', 'Ice Wolves'];
  const sports = ['Table Tennis', 'Badminton', 'Chess', 'Basketball'];
  const venues = ['Sports Complex A', 'Sports Complex B', 'Main Hall', 'Outdoor Court 1', 'Outdoor Court 2'];

  useEffect(() => {
    // Mock schedule data
    const mockMatches: Match[] = [
      {
        id: 1,
        team1: 'Thunder Hawks',
        team2: 'Lightning Bolts',
        sport: 'Table Tennis',
        dateTime: new Date('2024-12-15T14:00:00'),
        venue: 'Sports Complex A',
        status: 'scheduled'
      },
      {
        id: 2,
        team1: 'Fire Dragons',
        team2: 'Storm Eagles',
        sport: 'Badminton',
        dateTime: new Date('2024-12-16T16:30:00'),
        venue: 'Sports Complex B',
        status: 'scheduled'
      },
      {
        id: 3,
        team1: 'Ice Wolves',
        team2: 'Thunder Hawks',
        sport: 'Table Tennis',
        dateTime: new Date('2024-12-14T10:00:00'),
        venue: 'Main Hall',
        status: 'completed',
        result: 'Ice Wolves won 3-2'
      }
    ];
    setMatches(mockMatches);
  }, []);

  const handleOpenDialog = (match?: Match) => {
    if (match) {
      setEditingMatch(match);
      setFormData({
        team1: match.team1,
        team2: match.team2,
        sport: match.sport,
        dateTime: match.dateTime,
        venue: match.venue
      });
    } else {
      setEditingMatch(null);
      setFormData({
        team1: '',
        team2: '',
        sport: '',
        dateTime: new Date(),
        venue: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMatch(null);
  };

  const handleSaveMatch = () => {
    if (editingMatch) {
      setMatches(matches.map(match =>
        match.id === editingMatch.id
          ? { ...match, ...formData, status: 'scheduled' as const }
          : match
      ));
    } else {
      const newMatch: Match = {
        id: Math.max(...matches.map(m => m.id), 0) + 1,
        ...formData,
        status: 'scheduled'
      };
      setMatches([...matches, newMatch]);
    }
    handleCloseDialog();
  };

  const handleDeleteMatch = (matchId: number) => {
    setMatches(matches.filter(match => match.id !== matchId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'ongoing': return 'warning';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const goBack = () => {
    navigate('/admin/dashboard'); // Use navigate instead of window.location.href
  };

  const scheduledMatches = matches.filter(m => m.status === 'scheduled');
  const completedMatches = matches.filter(m => m.status === 'completed');

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{
        minHeight: '100vh',
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
                <IconButton
                  onClick={goBack}
                  sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.04)', // A subtle background for the icon button
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.08)', // Darker on hover
                    },
                    borderRadius: '50%', // Make it circular
                    p: 1, // Add some padding
                    color: 'text.secondary' // Default icon color
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <Avatar sx={{ bgcolor: '#1e3c72', width: 56, height: 56 }}>
                  <ScheduleIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    Schedule Management
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Manage upcoming and past matches
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
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
                Add New Match
              </Button>
            </Box>
          </Paper>

          {/* Scheduled Matches Section */}
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
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday color="primary" />
              Scheduled Matches ({scheduledMatches.length})
            </Typography>
            {scheduledMatches.length === 0 ? (
              <Alert severity="info">No upcoming matches scheduled.</Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Match</TableCell>
                      <TableCell>Sport</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Venue</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scheduledMatches.map((match) => (
                      <TableRow key={match.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Groups fontSize="small" />
                            <Typography variant="body2" fontWeight="bold">{match.team1}</Typography>
                            <Typography variant="body2" sx={{ mx: 0.5 }}>vs</Typography>
                            <Typography variant="body2" fontWeight="bold">{match.team2}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={match.sport}
                            size="small"
                            icon={<SportsTennis />}
                            color="info"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarToday fontSize="small" />
                            {match.dateTime.toLocaleDateString()}
                            <AccessTime fontSize="small" sx={{ ml: 1 }} />
                            {match.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <LocationOn fontSize="small" />
                            {match.venue}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={match.status}
                            size="small"
                            color={getStatusColor(match.status)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit Match">
                            <IconButton onClick={() => handleOpenDialog(match)} size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Match">
                            <IconButton onClick={() => handleDeleteMatch(match.id)} size="small" color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          {/* Completed Matches Section */}
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
              <EmojiEvents color="secondary" /> {/* Assuming EmojiEvents for completed */}
              Completed Matches ({completedMatches.length})
            </Typography>
            {completedMatches.length === 0 ? (
              <Alert severity="info">No completed matches available.</Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Match</TableCell>
                      <TableCell>Sport</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Venue</TableCell>
                      <TableCell>Result</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {completedMatches.map((match) => (
                      <TableRow key={match.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Groups fontSize="small" />
                            <Typography variant="body2" fontWeight="bold">{match.team1}</Typography>
                            <Typography variant="body2" sx={{ mx: 0.5 }}>vs</Typography>
                            <Typography variant="body2" fontWeight="bold">{match.team2}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={match.sport}
                            size="small"
                            icon={<SportsTennis />}
                            color="info"
                          />
                        </TableCell>
                        <TableCell>{match.dateTime.toLocaleDateString()}</TableCell>
                        <TableCell>{match.venue}</TableCell>
                        <TableCell>
                          <Chip
                            label={match.result || 'N/A'}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={match.status}
                            size="small"
                            color={getStatusColor(match.status)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Match">
                            <IconButton onClick={() => handleDeleteMatch(match.id)} size="small" color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Add/Edit Match Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {editingMatch ? <EditIcon /> : <AddIcon />}
          {editingMatch ? 'Edit Match' : 'Add New Match'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Team 1"
                value={formData.team1}
                onChange={(e) => setFormData({ ...formData, team1: e.target.value })}
                variant="outlined"
                margin="normal"
                sx={{ borderRadius: 2 }}
              >
                {teams.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Team 2"
                value={formData.team2}
                onChange={(e) => setFormData({ ...formData, team2: e.target.value })}
                variant="outlined"
                margin="normal"
                sx={{ borderRadius: 2 }}
              >
                {teams.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Sport"
                value={formData.sport}
                onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                variant="outlined"
                margin="normal"
                sx={{ borderRadius: 2 }}
              >
                {sports.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Date and Time"
                  value={formData.dateTime}
                  onChange={(newValue) => setFormData({ ...formData, dateTime: newValue || new Date() })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                variant="outlined"
                margin="normal"
                sx={{ borderRadius: 2 }}
              >
                {venues.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined" sx={{ borderRadius: 2, px: 3 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveMatch}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: 2,
              px: 4,
              background: 'linear-gradient(45deg, #1e3c72, #2a5298)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1a3460, #235a8a)',
              }
            }}
          >
            {editingMatch ? 'Save Changes' : 'Add Match'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ScheduleManagement;