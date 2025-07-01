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

  // Get admin credentials from environment variables (Vite syntax)
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@sportstournament.com';
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

  // Debug: Check if environment variables are loaded
  console.log('Admin Email from env:', ADMIN_EMAIL);
  console.log('Admin Password from env:', ADMIN_PASSWORD ? '***' : 'undefined');

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Check if environment variables are loaded
      if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        setError('Admin credentials not configured. Please check environment variables.');
        setLoading(false);
        return;
      }

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
            InputLabelProps={{
              sx: {
                transform: 'translate(14px, 19px) scale(1)',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -3px) scale(0.75)',
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
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
            InputLabelProps={{
              sx: {
                transform: 'translate(14px, 19px) scale(1)',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -3px) scale(0.75)',
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
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