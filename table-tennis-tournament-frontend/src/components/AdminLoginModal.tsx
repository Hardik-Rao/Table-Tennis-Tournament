// src/components/AdminLoginModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Avatar
} from '@mui/material';
import {
  AdminPanelSettings,
  Visibility,
  VisibilityOff,
  Lock,
  Email
} from '@mui/icons-material';

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Predefined admin credentials (later move to env file)
  const ADMIN_EMAIL = 'admin@sportstournament.com';
  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Store admin session
        const adminSession = {
          email: email,
          role: 'admin',
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('adminSession', JSON.stringify(adminSession));

        // Navigate to admin dashboard
        window.location.href = '/admin/dashboard';
      } else {
        setError('Invalid email or password. Please check your credentials.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    setShowPassword(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar sx={{
            bgcolor: 'primary.main',
            width: 64,
            height: 64,
            background: 'linear-gradient(45deg, #1e3c72, #2a5298)'
          }}>
            <AdminPanelSettings fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Admin Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your admin credentials to access the dashboard
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Admin Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
            // Use InputLabelProps to target the label directly
            InputLabelProps={{
              sx: {
                // Adjust translateY for default (not-shrunk) state
                transform: 'translate(14px, 19px) scale(1)', // Increased to 19px
                '&.MuiInputLabel-shrink': {
                  // Adjust translateY for shrunk state
                  transform: 'translate(14px, -3px) scale(0.75)', // Adjusted to -3px (less negative)
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
              // Removed the redundant label styling from here
            }}
          />

          <TextField
            fullWidth
            label="Admin Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            // Apply similar adjustments for password field for consistency
            InputLabelProps={{
              sx: {
                transform: 'translate(14px, 19px) scale(1)', // Adjusted to 19px
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -3px) scale(0.75)', // Adjusted to -3px
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
              // Removed the redundant label styling from here
            }}
          />

          {/* Demo Credentials Display */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'rgba(25, 118, 210, 0.1)',
              borderRadius: 2,
              border: '1px solid rgba(25, 118, 210, 0.2)'
            }}
          >
            <Typography variant="body2" fontWeight="bold" color="primary" gutterBottom>
              Demo Credentials:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              <strong>Email:</strong> admin@sportstournament.com<br />
              <strong>Password:</strong> admin123
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleLogin}
          variant="contained"
          disabled={!email || !password || loading}
          sx={{
            borderRadius: 2,
            px: 4,
            background: 'linear-gradient(45deg, #1e3c72, #2a5298)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1a3460, #235a8a)',
            }
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminLoginModal;