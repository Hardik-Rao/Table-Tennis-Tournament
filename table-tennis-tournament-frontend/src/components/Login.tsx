// src/pages/Login.jsx
import { useState } from "react";
import { 
  TextField, 
  Button, 
  Typography,
  Paper,
  Grid,
  InputAdornment,
  IconButton,
  Alert,
  Link
} from "@mui/material";
import { 
  Login as LoginIcon, 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
  Person,
  School
} from '@mui/icons-material';

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!loginData.email || !loginData.password) {
      setError("Please enter both email and password");
      return;
    }

    if (!loginData.email.includes("@college.edu")) {
      setError("Please use your college email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Login successful! Redirecting to dashboard...");
        
        // Store token and user data
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('teamData', JSON.stringify(data.data.team));
        
        // Redirect to dashboard after success message
        setTimeout(() => {
          window.location.href = "/dashboard"; // or use React Router navigation
        }, 2000);
        
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert("Forgot password functionality will be implemented soon!");
    // In real app, navigate to forgot password page
  };

  const handleRegisterRedirect = () => {
    window.location.href = "/register"; // or use React Router navigation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        <Paper elevation={24} className="rounded-3xl overflow-hidden backdrop-blur-sm bg-white/90">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <School className="text-4xl" />
                </div>
              </div>
              <Typography variant="h4" component="h1" className="font-bold mb-2">
                Welcome Back
              </Typography>
              <Typography variant="body1" className="opacity-90">
                Table Tennis Team Portal
              </Typography>
            </div>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert severity="error" className="mb-4">
                  {error}
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert severity="success" className="mb-4">
                  {success}
                </Alert>
              )}

              {/* Email Field */}
              <TextField
                fullWidth
                label="College Email"
                type="email"
                value={loginData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="yourname@college.edu"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                className="mb-4"
                disabled={isLoading}
              />

              {/* Password Field */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                disabled={isLoading}
              />

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  component="button"
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  disabled={isLoading}
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3 text-lg font-semibold shadow-lg"
                startIcon={isLoading ? null : <LoginIcon />}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <Typography variant="body2" className="text-gray-600 mb-2">
                Don't have an account?
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleRegisterRedirect}
                disabled={isLoading}
                startIcon={<Person />}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Register as Team Captain
              </Button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <Typography variant="caption" className="text-gray-600 block mb-2">
                <strong>Test Credentials:</strong>
              </Typography>
              <Typography variant="caption" className="text-gray-600 block">
                Email: captain1@college.edu → Password: password123
              </Typography>
              <Typography variant="caption" className="text-gray-600 block">
                Email: captain2@college.edu → Password: admin123
              </Typography>
              <Typography variant="caption" className="text-gray-600 block">
                Email: captain3@college.edu → Password: test123
              </Typography>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default Login;