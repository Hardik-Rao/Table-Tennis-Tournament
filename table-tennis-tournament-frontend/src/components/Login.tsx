// src/pages/Login.jsx
import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon
} from '@mui/icons-material';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        // Store the JWT token with the key expected by Dashboard
        localStorage.setItem('authToken', response.data.data.token);
        
        // Store user session info with the key expected by Dashboard
        localStorage.setItem('userSession', JSON.stringify({
          email: response.data.data.team.captain_email,
          name: response.data.data.team.captain_name,
          teamId: response.data.data.team.team_id,
          teamName: response.data.data.team.team_name,
          captainRollNumber: response.data.data.team.captain_roll_number,
          captainBranch: response.data.data.team.captain_branch,
          captainYear: response.data.data.team.captain_year,
          captainPhone: response.data.data.team.captain_phone,
          primarySport: response.data.data.team.primary_sport
        }));

        // Optional: Also store team info for backward compatibility
        localStorage.setItem('teamInfo', JSON.stringify({
          teamId: response.data.data.team.team_id,
          teamName: response.data.data.team.team_name,
          captainName: response.data.data.team.captain_name,
          captainEmail: response.data.data.team.captain_email
        }));

        console.log('Login successful, redirecting to dashboard...');
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please check if the server is running.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box textAlign="center" mb={4}>
            <LoginIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
              Team Captain Login
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to manage your team
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
              helperText="Use your college email (@iitjammu.ac.in)"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
                }
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Button
                variant="text"
                onClick={() => window.location.href = '/register'}
                sx={{ textTransform: 'none' }}
              >
                Register your team
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;