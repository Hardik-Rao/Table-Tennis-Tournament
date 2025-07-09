// src/pages/Registration.tsx - TypeScript Fixed Version
import { useState } from "react";
import { 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Grid,
  Typography,
  Paper,
  Divider,
  Alert,
  Box,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  CircularProgress
} from "@mui/material";
import PlayerDetailForm from "../components/PlayerDetailForm";

// Define interfaces
interface FormData {
  email: string;
  fullName: string;
  rollNumber: string;
  branch: string;
  year: string;
  phoneNumber: string;
  whatsappNumber: string;
  hostelName: string;
  roomNumber: string;
  teamName: string;
  primarySport: string;
  password: string;
  confirmPassword: string;
  [key: string]: string; // Index signature for dynamic access
}

interface PlayerData {
  name?: string;
  rollNumber?: string;
  branch?: string;
  year?: string;
  phoneNumber?: string;
  sport?: string;
  playingStyle?: string;
  gripStyle?: string;
  rubberType?: string;
  [key: string]: string | undefined; // Index signature for dynamic access
}

interface PlayersData {
  1: PlayerData;
  2: PlayerData;
  3: PlayerData;
}

interface RegistrationPlayerData {
  player_name: string;
  roll_number: string;
  branch: string;
  year: string;
  phone_number: string;
  sport: string;
  playing_style: string;
  grip_style: string;
  rubber_type: string;
}

interface RegistrationData {
  team_name: string;
  captain_email: string;
  captain_name: string;
  captain_roll_number: string;
  captain_branch: string;
  captain_year: string;
  captain_phone: string;
  password: string;
  primary_sport: string;
  players: RegistrationPlayerData[];
}

const Registration = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    fullName: "",
    rollNumber: "",
    branch: "",
    year: "",
    phoneNumber: "",
    whatsappNumber: "",
    hostelName: "",
    roomNumber: "",
    teamName: "",
    primarySport: "",
    password: "",
    confirmPassword: ""
  });
  
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  
  // Player data for 3 players
  const [playersData, setPlayersData] = useState<PlayersData>({
    1: {},
    2: {},
    3: {}
  });

  const branches = [
    "Computer Science and Engineering",
    "Electronics and Communication Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Biotechnology",
    "Materials Science and Engineering",
    "Mathematics and Computing",
    "Engineering Physics"
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
  
  const sports = [
    "Badminton", "Tennis", "Table Tennis", "Basketball", 
    "Football", "Cricket", "Volleyball", "Swimming", "Athletics"
  ];

  const steps = ['Captain Verification', 'Captain Details', 'Team Players', 'Complete Registration'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlayerDataChange = (playerNumber: number, field: string, value: string) => {
    setPlayersData(prev => ({
      ...prev,
      [playerNumber]: {
        ...prev[playerNumber as keyof PlayersData],
        [field]: value
      }
    }));
  };

  // Generate 6-digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // FRONTEND-ONLY VERSION - Simulate sending OTP
  const sendOtp = async () => {
    // Validation
    if (!formData.email.endsWith("@iitjammu.ac.in")) {
      setOtpError("Please use your @iitjammu.ac.in email address");
      return;
    }

    if (!formData.fullName.trim()) {
      setOtpError("Please enter your full name");
      return;
    }

    setLoading(true);
    setOtpError("");

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate OTP (in real app, this would be sent via email)
      const newOTP = generateOTP();
      setGeneratedOTP(newOTP);
      
      setOtpSent(true);
      
      // Show the OTP in console for testing (remove in production)
      console.log("🔐 Generated OTP for testing:", newOTP);
      
      alert(`📧 OTP Generation Successful!\n\n🔐 Your OTP: ${newOTP}\n\n(In production, this would be sent to ${formData.email})\n\nFor testing: Check the browser console for the OTP.`);
    } catch (error) {
      console.error("Error generating OTP:", error);
      setOtpError("Failed to generate OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError("Please enter the OTP");
      return;
    }

    if (otp === generatedOTP) {
      setVerified(true);
      setOtpError("");
      alert("✅ Email verified successfully! Please complete your team captain registration.");
    } else {
      setOtpError("❌ Invalid OTP. Please check the console or alert message for the correct OTP.");
    }
  };

  const resendOtp = async () => {
    if (loading) return;
    
    setOtp("");
    setOtpError("");
    await sendOtp();
  };

  const validateCaptainDetails = () => {
    const requiredFields: (keyof FormData)[] = ['fullName', 'rollNumber', 'branch', 'year', 'phoneNumber', 'teamName', 'primarySport', 'password'];
    const missingFields = requiredFields.filter(field => !formData[field] || !formData[field].trim());
    
    if (missingFields.length > 0) {
      alert("Please fill in all required captain details: " + missingFields.join(', '));
      return false;
    }
    
    // Password validation
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return false;
    }
    
    return true;
  };

  const validatePlayersData = () => {
    // Updated to include ALL required fields from PlayerDetailForm
    const requiredPlayerFields = [
      'name', 
      'rollNumber', 
      'branch', 
      'year', 
      'phoneNumber', 
      'sport',
      'playingStyle',  
      'gripStyle',     
      'rubberType'     
    ];
    
    for (let i = 1; i <= 3; i++) {
      const player = playersData[i as keyof PlayersData];
      const missingFields = requiredPlayerFields.filter(field => !player[field] || !player[field]?.trim());
      
      if (missingFields.length > 0) {
        alert(`Player ${i} is missing required fields: ${missingFields.join(', ')}`);
        return false;
      }
    }
    return true;
  };

  const getCompletionPercentage = () => {
    if (!verified) return 0;
    
    let completed = 25; // Email verified
    
    // Captain details completion
    const captainRequiredFields: (keyof FormData)[] = ['fullName', 'rollNumber', 'branch', 'year', 'phoneNumber', 'teamName', 'primarySport','password'];
    const captainCompleted = captainRequiredFields.filter(field => formData[field] && formData[field].trim()).length;
    completed += (captainCompleted / captainRequiredFields.length) * 25;
    
    // Players completion - Updated to include all required fields
    const playerRequiredFields = [
      'name', 
      'rollNumber', 
      'branch', 
      'year', 
      'phoneNumber', 
      'sport',
      'playingStyle',
      'gripStyle',
      'rubberType'
    ];
    let totalPlayerFields = 0;
    let completedPlayerFields = 0;
    
    for (let i = 1; i <= 3; i++) {
      const player = playersData[i as keyof PlayersData];
      totalPlayerFields += playerRequiredFields.length;
      completedPlayerFields += playerRequiredFields.filter(field => player[field] && player[field]?.trim()).length;
    }
    
    completed += (completedPlayerFields / totalPlayerFields) * 50;
    
    return Math.round(completed);
  };

  // FRONTEND-ONLY VERSION - Simulate registration submission
  const submitRegistration = async () => {
    if (!validateCaptainDetails() || !validatePlayersData()) {
      return;
    }

    // Transform the data to match your API structure
    const registrationData: RegistrationData = {
      team_name: formData.teamName,
      captain_email: formData.email,
      captain_name: formData.fullName,
      captain_roll_number: formData.rollNumber,
      captain_branch: formData.branch,
      captain_year: formData.year,
      captain_phone: formData.phoneNumber,
      password: formData.password,
      primary_sport: formData.primarySport,
      players: []
    };

    // Transform players data to match API structure
    for (let i = 1; i <= 3; i++) {
      const player = playersData[i as keyof PlayersData];
      if (player.name) { // Only add if player data exists
        registrationData.players.push({
          player_name: player.name,
          roll_number: player.rollNumber!,
          branch: player.branch!,
          year: player.year!,
          phone_number: player.phoneNumber!,
          sport: player.sport!,
          playing_style: player.playingStyle!,
          grip_style: player.gripStyle!,
          rubber_type: player.rubberType!
        });
      }
    }

    try {
      setLoading(true);
      
      // Make the POST request to your API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      // Log response details for debugging
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
      // Get response text first to see what we're dealing with
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        // Try to parse error as JSON, fallback to text
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        } catch (jsonError) {
          errorMessage = `HTTP ${response.status}: ${responseText || 'Unknown error'}`;
        }
        throw new Error(errorMessage);
      }

      // Try to parse success response as JSON
      let result;
      try {
        result = JSON.parse(responseText);
        console.log("Registration successful:", result);
      } catch (jsonError) {
        console.log("Response is not JSON, treating as text:", responseText);
        result = { message: responseText };
      }
      
      alert("🎉 Team registration completed successfully!");
      
      // Reset all forms
      setFormData({
        email: "",
        fullName: "",
        rollNumber: "",
        branch: "",
        year: "",
        phoneNumber: "",
        whatsappNumber: "",
        hostelName: "",
        roomNumber: "",
        teamName: "",
        primarySport: "",
        password: "",
        confirmPassword: ""
      });
      setPlayersData({ 1: {}, 2: {}, 3: {} });
      setOtpSent(false);
      setOtp("");
      setVerified(false);
      setGeneratedOTP("");
      
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Registration failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStep = () => {
    if (!verified) return 0;

    const requiredCaptainFields: (keyof FormData)[] = ['fullName', 'rollNumber', 'branch', 'year', 'phoneNumber', 'teamName', 'primarySport','password'];
    const captainIncomplete = requiredCaptainFields.some(field => !formData[field] || !formData[field].trim());
    if (captainIncomplete) return 1;

    const requiredPlayerFields = [
      'name', 
      'rollNumber', 
      'branch', 
      'year', 
      'phoneNumber', 
      'sport',
      'playingStyle',
      'gripStyle',
      'rubberType'
    ];
    for (let i = 1; i <= 3; i++) {
      const player = playersData[i as keyof PlayersData];
      const missing = requiredPlayerFields.some(field => !player[field] || !player[field]?.trim());
      if (missing) return 2;
    }

    return 3;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="max-w-7xl mx-auto">
        <Paper elevation={8} className="rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
            <Typography variant="h3" component="h1" className="font-bold mb-2">
              Team Captain Registration
            </Typography>
            <Typography variant="h6" className="opacity-90">
              Register your team for the upcoming tournament!
            </Typography>
            <Typography variant="body2" className="mt-2 opacity-75">
              🚧 Frontend Demo Mode - No Backend Required 🚧
            </Typography>
          </div>

          <div className="p-8">
            {/* Demo Notice */}
            <Alert severity="info" className="mb-6">
              <Typography variant="body2">
                <strong>🔧 Demo Mode:</strong> This is a frontend-only version for testing. 
                OTP will be shown in alerts/console, and registration data will be logged to console.
              </Typography>
            </Alert>

            {/* Progress Indicator */}
            <Box mb={4}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Registration Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getCompletionPercentage()}% Complete
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={getCompletionPercentage()} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 4
                  }
                }}
              />
              
              <Box mt={3}>
                <Stepper activeStep={getCurrentStep()} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Box>

            {/* Email Verification Section */}
            <div className="mb-8">
              <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
                Team Captain Verification
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Captain's IIT Jammu Email *"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="captain@iitjammu.ac.in"
                    helperText="Use your official IIT Jammu email"
                    disabled={otpSent}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Captain's Full Name *"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter captain's full name"
                    disabled={otpSent}
                  />
                </Grid>
              </Grid>

              {/* Error Display */}
              {otpError && (
                <Alert severity="error" className="mt-4">
                  {otpError}
                </Alert>
              )}

              <div className="mt-4">
                {!otpSent ? (
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={sendOtp}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {loading ? "Generating OTP..." : "Generate OTP (Demo Mode)"}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-4 items-end">
                      <TextField
                        label="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        helperText="Check the alert message or console for OTP"
                        className="flex-1"
                        inputProps={{ maxLength: 6 }}
                      />
                      <Button 
                        variant="contained" 
                        size="large"
                        onClick={verifyOtp}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Verify OTP
                      </Button>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      <Typography variant="body2" color="text.secondary">
                        Didn't receive OTP?
                      </Typography>
                      <Button 
                        variant="text" 
                        onClick={resendOtp}
                        disabled={loading}
                        className="text-blue-600"
                      >
                        {loading ? "Generating..." : "Generate New OTP"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {verified && (
                <div className="mt-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                    <Typography className="text-green-700 font-medium">
                      ✅ Email verified successfully!
                    </Typography>
                  </div>
                  
                  {/* Account Setup Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <Typography variant="h6" className="mb-4 font-semibold text-blue-800">
                      Account Setup
                    </Typography>
                    <Typography variant="body2" className="mb-4 text-blue-600">
                      Create a secure password for your team captain account
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="password"
                          label="Create Password *"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Create a strong password"
                          helperText="Minimum 8 characters"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="password"
                          label="Confirm Password *"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          placeholder="Confirm your password"
                          error={formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0}
                          helperText={formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0 ? "Passwords don't match" : ""}
                        />
                      </Grid>
                    </Grid>
                    
                    <Typography variant="body2" className="mt-4 text-gray-600">
                      Once you complete the password setup, you can proceed with team registration details below.
                    </Typography>
                  </div>
                </div>
              )}
            </div>

            {verified && (
              <>
                <Divider className="my-8" />
                
                {/* Captain Information */}
                <div className="mb-8">
                  <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
                    Team Captain Details
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Roll Number *"
                        value={formData.rollNumber}
                        onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                        placeholder="e.g., 2023UCS1001"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Branch *</InputLabel>
                        <Select
                          value={formData.branch}
                          onChange={(e) => handleInputChange('branch', e.target.value as string)}
                          label="Branch *"
                        >
                          {branches.map((branch) => (
                            <MenuItem key={branch} value={branch}>
                              {branch}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Current Year *</InputLabel>
                        <Select
                          value={formData.year}
                          onChange={(e) => handleInputChange('year', e.target.value as string)}
                          label="Current Year *"
                        >
                          {years.map((year) => (
                            <MenuItem key={year} value={year}>
                              {year}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number *"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        placeholder="+91 9876543210"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Team Name *"
                        value={formData.teamName}
                        onChange={(e) => handleInputChange('teamName', e.target.value)}
                        placeholder="Enter your team name"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Primary Sport *</InputLabel>
                        <Select
                          value={formData.primarySport}
                          onChange={(e) => handleInputChange('primarySport', e.target.value as string)}
                          label="Primary Sport *"
                        >
                          {sports.map((sport) => (
                            <MenuItem key={sport} value={sport}>
                              {sport}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="WhatsApp Number"
                        value={formData.whatsappNumber}
                        onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                        placeholder="If different from phone number"
                      />
                    </Grid>
                  </Grid>
                </div>

                <Divider className="my-8" />

                {/* Team Players Section */}
                <div className="mb-8">
                  <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
                    Team Players Details
                  </Typography>
                  <Typography variant="body1" className="mb-6 text-gray-600">
                    Please enter details for all 3 team players (including yourself if you're playing)
                  </Typography>
                  
                  <Grid container spacing={4}>
                    {[1, 2, 3].map((playerNumber) => (
                      <Grid item xs={12} lg={4} key={playerNumber}>
                        <PlayerDetailForm
                          playerNumber={playerNumber}
                          playerData={playersData[playerNumber as keyof PlayersData]}
                          onPlayerDataChange={handlePlayerDataChange}
                          branches={branches}
                          years={years}
                          sports={sports}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={submitRegistration}
                    disabled={getCompletionPercentage() < 100 || loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-12 py-3 text-lg font-semibold"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {loading ? "Saving Registration..." : "Complete Team Registration (Demo)"}
                  </Button>
                  
                  {getCompletionPercentage() < 100 && (
                    <Typography variant="body2" className="mt-2 text-gray-500">
                      Please complete all required fields to submit registration
                    </Typography>
                  )}
                </div>
              </>
            )}
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default Registration;