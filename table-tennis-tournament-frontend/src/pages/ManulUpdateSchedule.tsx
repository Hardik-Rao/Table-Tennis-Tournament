import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Paper,
  TextField,
  MenuItem,
  Alert,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Schedule as ScheduleIcon,
  CalendarToday,
  LocationOn,
  AccessTime,
  Edit,
  Delete,
  Groups,
  Save,
  Cancel
} from '@mui/icons-material';

interface Team {
  id: number;
  name: string;
  sport: string;
}

interface Match {
  id: number;
  team1: Team;
  team2: Team;
  date: string;
  time: string;
  venue: string;
  sport: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

interface MatchFormData {
  team1Name: string;
  team2Name: string;
  date: string;
  time: string;
  venue: string;
  sport: string;
}

const ManualUpdateSchedule: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<MatchFormData>({
    team1Name: '',
    team2Name: '',
    date: '',
    time: '',
    venue: '',
    sport: ''
  });

  const sports = ['Table Tennis', 'Badminton', 'Chess', 'Basketball', 'Football'];
  const venues = [
    'Sports Complex Court 1',
    'Sports Complex Court 2', 
    'Indoor Hall A',
    'Indoor Hall B',
    'Main Ground',
    'Basketball Court',
    'Table Tennis Room'
  ];

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
     const response = await fetch(`${import.meta.env.VITE_API_URL}api/matches`);

      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setMatches(data.data.matches);
      } else {
        throw new Error(data.message || 'Failed to fetch matches');
      }
      
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.location.href = '/admin/dashboard';
  };

  const handleOpenDialog = (match?: Match) => {
    if (match) {
      setEditingMatch(match);
      setFormData({
        team1Name: match.team1.name,
        team2Name: match.team2.name,
        date: match.date,
        time: match.time,
        venue: match.venue,
        sport: match.sport
      });
    } else {
      setEditingMatch(null);
      setFormData({
        team1Name: '',
        team2Name: '',
        date: '',
        time: '',
        venue: '',
        sport: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMatch(null);
  };

  const handleInputChange = (field: keyof MatchFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Validation
      if (!formData.team1Name || !formData.team2Name || !formData.date || !formData.time || !formData.venue || !formData.sport) {
        alert('Please fill in all required fields');
        return;
      }

      if (formData.team1Name.trim() === formData.team2Name.trim()) {
        alert('Please enter different team names');
        return;
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.date)) {
        alert('Please enter date in YYYY-MM-DD format (e.g., 2025-07-01)');
        return;
      }

      // Validate time format (HH:MM)
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(formData.time)) {
        alert('Please enter time in HH:MM format (e.g., 14:30)');
        return;
      }

      const baseUrl = import.meta.env.VITE_API_URL;

const url = editingMatch
  ? `${baseUrl}api/matches/${editingMatch.id}`
  : `${baseUrl}api/matches`;
      
      const method = editingMatch ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save match');
      }

      if (data.success) {
        alert(data.message);
        handleCloseDialog();
        fetchMatches(); // Refresh the matches list
      } else {
        throw new Error(data.message || 'Failed to save match');
      }

    } catch (error) {
      console.error('Error saving match:', error);
      alert(error instanceof Error ? error.message : 'Failed to save match');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMatch = async (matchId: number) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
       const response = await fetch(`${import.meta.env.VITE_API_URL}api/matches/${matchId}`, {
  method: 'DELETE'
});


        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete match');
        }

        if (data.success) {
          alert(data.message);
          fetchMatches(); // Refresh the matches list
        } else {
          throw new Error(data.message || 'Failed to delete match');
        }

      } catch (error) {
        console.error('Error deleting match:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete match');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'ongoing': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
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
          <Typography variant="h6">Loading schedule data...</Typography>
        </Paper>
      </Box>
    );
  }

  return (
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
              <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                <ArrowBack />
              </IconButton>
              <Avatar sx={{ bgcolor: '#1e3c72', width: 56, height: 56 }}>
                <ScheduleIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  Update Schedule
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Manage tournament matches and schedules
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<Add />}
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

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <ScheduleIcon fontSize="large" sx={{ mb: 1 }} />
                <Typography variant="h3" fontWeight="bold">
                  {matches.length}
                </Typography>
                <Typography variant="h6">Total Matches</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
              color: '#8b4513',
              borderRadius: 3
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <CalendarToday fontSize="large" sx={{ mb: 1 }} />
                <Typography variant="h3" fontWeight="bold">
                  {matches.filter(m => m.status === 'scheduled').length}
                </Typography>
                <Typography variant="h6">Scheduled</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              color: '#2c5530',
              borderRadius: 3
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <AccessTime fontSize="large" sx={{ mb: 1 }} />
                <Typography variant="h3" fontWeight="bold">
                  {matches.filter(m => m.status === 'ongoing').length}
                </Typography>
                <Typography variant="h6">Ongoing</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
              color: '#6b2c91',
              borderRadius: 3
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Groups fontSize="large" sx={{ mb: 1 }} />
                <Typography variant="h3" fontWeight="bold">
                  {matches.filter(m => m.status === 'completed').length}
                </Typography>
                <Typography variant="h6">Completed</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Matches Table */}
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
            <ScheduleIcon color="primary" />
            Scheduled Matches
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {matches.length === 0 ? (
            <Box display="flex" justifyContent="center" py={8}>
              <Alert severity="info">
                <Typography variant="h6">No Matches Scheduled</Typography>
                <Typography>Click "Add New Match" to schedule your first match.</Typography>
              </Alert>
            </Box>
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
                  {matches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {match.team1.name} vs {match.team2.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={match.sport} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CalendarToday fontSize="small" color="action" />
                          <Typography variant="body2">
                            {new Date(match.date).toLocaleDateString()}
                          </Typography>
                          <AccessTime fontSize="small" color="action" sx={{ ml: 1 }} />
                          <Typography variant="body2">
                            {match.time}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2">
                            {match.venue}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={match.status.charAt(0).toUpperCase() + match.status.slice(1)} 
                          size="small" 
                          color={getStatusColor(match.status) as any}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog(match)}
                          sx={{ mr: 1 }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteMatch(match.id)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      {/* Add/Edit Match Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {editingMatch ? 'Edit Match' : 'Schedule New Match'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                label="Sport"
                value={formData.sport}
                onChange={(e) => handleInputChange('sport', e.target.value)}
                fullWidth
                required
              >
                {sports.map((sport) => (
                  <MenuItem key={sport} value={sport}>
                    {sport}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Team 1 Name"
                value={formData.team1Name}
                onChange={(e) => handleInputChange('team1Name', e.target.value)}
                fullWidth
                required
                placeholder="Enter team 1 name"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Team 2 Name"
                value={formData.team2Name}
                onChange={(e) => handleInputChange('team2Name', e.target.value)}
                fullWidth
                required
                placeholder="Enter team 2 name"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Match Date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                fullWidth
                required
                placeholder="YYYY-MM-DD (e.g., 2025-07-01)"
                helperText="Format: YYYY-MM-DD"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Match Time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                fullWidth
                required
                placeholder="HH:MM (e.g., 14:30)"
                helperText="Format: HH:MM (24-hour format)"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Venue"
                value={formData.venue}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                fullWidth
                required
              >
                {venues.map((venue) => (
                  <MenuItem key={venue} value={venue}>
                    {venue}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            startIcon={<Cancel />}
            disabled={submitting}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<Save />}
            disabled={submitting}
            sx={{
              background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
              '&:hover': {
                background: 'linear-gradient(45deg, #388e3c, #4caf50)',
              }
            }}
          >
            {submitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Saving...
              </>
            ) : (
              editingMatch ? 'Update Match' : 'Schedule Match'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManualUpdateSchedule;