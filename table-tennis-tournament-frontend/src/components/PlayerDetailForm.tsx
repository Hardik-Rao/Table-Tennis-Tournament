// src/components/PlayerDetailForm.tsx
import {
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Avatar,
  Paper
} from "@mui/material";
import {
  SportsTennis,
  School,
  Group,
  Person,
} from "@mui/icons-material";

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
  team?: string;
  whatsappNumber?: string;
}

interface PlayerDetailFormProps {
  playerNumber: number;
  playerData: PlayerData;
  onPlayerDataChange: (playerNumber: number, field: string, value: string) => void;
  branches: string[];
  years: string[];
  sports?: string[];
}

const PlayerDetailForm: React.FC<PlayerDetailFormProps> = ({ 
  playerNumber, 
  playerData, 
  onPlayerDataChange, 
  branches, 
  years,
  sports = ["Badminton", "Tennis", "Table Tennis", "Basketball", "Football", "Cricket", "Volleyball"]
}) => {
  const handleInputChange = (field: string, value: string): void => {
    onPlayerDataChange(playerNumber, field, value);
  };

  const getPlayerInitials = (name: string | undefined): string => {
    if (!name) return `P${playerNumber}`;
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  const isComplete = playerData.name && playerData.rollNumber && playerData.branch &&
                     playerData.year && playerData.phoneNumber && playerData.sport &&
                     playerData.playingStyle && playerData.gripStyle && playerData.rubberType;

  interface SectionHeaderProps {
    icon: React.ComponentType<any>;
    title: string;
    color?: string;
  }

  const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, color = "primary" }) => (
    <Paper 
      elevation={1}
      sx={{ 
        p: 2, 
        mb: 3, 
        bgcolor: `${color}.50`,
        border: `2px solid`,
        borderColor: `${color}.200`,
        borderRadius: 2
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: `${color}.main`, width: 32, height: 32 }}>
          <Icon fontSize="small" />
        </Avatar>
        <Typography variant="h6" fontWeight="bold" color={`${color}.800`}>
          {title}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Card 
      sx={{ 
        height: '100%',
        borderRadius: 4,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        border: '3px solid',
        borderColor: isComplete ? 'success.main' : 'primary.main',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Paper 
          elevation={2}
          sx={{ 
            p: 3, 
            mb: 4, 
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: 3,
            textAlign: 'center'
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'white',
              color: 'primary.main',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              mx: 'auto',
              mb: 2,
              border: '3px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            {getPlayerInitials(playerData.name)}
          </Avatar>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            Player {playerNumber}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {playerData.name || 'Enter Player Details Below'}
          </Typography>
        </Paper>

        {/* Personal Information Section */}
        <SectionHeader icon={Person} title="Personal Information" color="primary" />
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                📝 Full Name *
              </Typography>
              <TextField
                fullWidth
                label="Enter player's complete name"
                value={playerData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., John Doe Smith"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                    '&:hover': { backgroundColor: '#f8f9fa' }
                  }
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                🎓 Roll Number *
              </Typography>
              <TextField
                fullWidth
                label="Student roll number"
                value={playerData.rollNumber || ''}
                onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                placeholder="e.g., 2023UCS1001"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                    '&:hover': { backgroundColor: '#f8f9fa' }
                  }
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                📱 Phone Number *
              </Typography>
              <TextField
                fullWidth
                label="Contact number"
                value={playerData.phoneNumber || ''}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="+91 9876543210"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                    '&:hover': { backgroundColor: '#f8f9fa' }
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Academic Information Section */}
        <SectionHeader icon={School} title="Academic Details" color="secondary" />
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                📚 Branch/Department *
              </Typography>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select your branch</InputLabel>
                <Select
                  value={playerData.branch || ''}
                  onChange={(e) => handleInputChange('branch', e.target.value)}
                  label="Select your branch"
                  sx={{
                    backgroundColor: 'background.paper',
                    '&:hover': { backgroundColor: '#f8f9fa' }
                  }}
                >
                  {branches.map((branch: string) => (
                    <MenuItem key={branch} value={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                📅 Current Year *
              </Typography>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select current year</InputLabel>
                <Select
                  value={playerData.year || ''}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  label="Select current year"
                  sx={{
                    backgroundColor: 'background.paper',
                    '&:hover': { backgroundColor: '#f8f9fa' }
                  }}
                >
                  {years.map((year: string) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>

        {/* Sports Information Section */}
        <SectionHeader icon={SportsTennis} title="Sports & Playing Details" color="warning" />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                🏓 Primary Sport *
              </Typography>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Choose your main sport</InputLabel>
                <Select
                  value={playerData.sport || ''}
                  onChange={(e) => handleInputChange('sport', e.target.value)}
                  label="Choose your main sport"
                  sx={{
                    backgroundColor: 'background.paper',
                    '&:hover': { backgroundColor: '#f8f9fa' }
                  }}
                >
                  {sports.map((sport: string) => (
                    <MenuItem key={sport} value={sport}>
                      {sport}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                ⚔️ Playing Style *
              </Typography>
              <FormControl fullWidth variant="outlined">
                <InputLabel>How do you play?</InputLabel>
                <Select
                  value={playerData.playingStyle || ''}
                  onChange={(e) => handleInputChange('playingStyle', e.target.value)}
                  label="How do you play?"
                  sx={{
                    backgroundColor: 'background.paper',
                    '&:hover': { backgroundColor: '#f8f9fa' }
                  }}
                >
                  <MenuItem value="Attacking">🔥 Attacking - Aggressive gameplay</MenuItem>
                  <MenuItem value="Defensive">🛡️ Defensive - Strategic gameplay</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                ✋ Grip Style *
              </Typography>
              <FormControl fullWidth variant="outlined">
                <InputLabel>How do you hold the paddle?</InputLabel>
                <Select
                  value={playerData.gripStyle || ''}
                  onChange={(e) => handleInputChange('gripStyle', e.target.value)}
                  label="How do you hold the paddle?"
                  sx={{
                    backgroundColor: 'background.paper',
                    '&:hover': { backgroundColor: '#f8f9fa' }
                  }}
                >
                  <MenuItem value="Penhold">✊ Penhold Grip</MenuItem>
                  <MenuItem value="Shakehand">🤝 Shakehand Grip</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                🏓 Rubber Type *
              </Typography>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Type of paddle rubber</InputLabel>
                <Select
                  value={playerData.rubberType || ''}
                  onChange={(e) => handleInputChange('rubberType', e.target.value)}
                  label="Type of paddle rubber"
                  sx={{
                    backgroundColor: 'background.paper',
                    '&:hover': { backgroundColor: '#f8f9fa' }
                  }}
                >
                  <MenuItem value="Inverted">🔄 Inverted</MenuItem>
                  <MenuItem value="Short Pip">📏 Short Pip</MenuItem>
                  <MenuItem value="Long Pip">📐 Long Pip</MenuItem>
                  <MenuItem value="Medium Pip">📊 Medium Pip</MenuItem>
                  <MenuItem value="Anti Spin">🚫 Anti Spin</MenuItem>
                  <MenuItem value="Sandwich Rubber">🥪 Sandwich Rubber</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>

        {/* Team Information Section */}
        <SectionHeader icon={Group} title="Team & Contact Details" color="info" />
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                👥 Team Name
              </Typography>
              <TextField
                fullWidth
                label="Your team name (optional)"
                value={playerData.team || ''}
                onChange={(e) => handleInputChange('team', e.target.value)}
                placeholder="e.g., Thunder Bolts"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                    '&:hover': { backgroundColor: '#f8f9fa' }
                  }
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                💬 WhatsApp Number
              </Typography>
              <TextField
                fullWidth
                label="WhatsApp contact (if different)"
                value={playerData.whatsappNumber || ''}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                placeholder="If different from phone number"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                    '&:hover': { backgroundColor: '#f8f9fa' }
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>

       {/* Completion Status */} 
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: isComplete ? 'success.50' : 'warning.50',
            border: '2px solid',
            borderColor: isComplete ? 'success.main' : 'warning.main',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h6" 
            fontWeight="bold"
            color={isComplete ? 'success.800' : 'warning.800'}
            sx={{ mb: 1 }}
          >
            {isComplete
              ? '🎉 Player Registration Complete!' 
              : '⚠️ Registration Incomplete'}
          </Typography>
          <Typography 
            variant="body1"
            color={isComplete ? 'success.700' : 'warning.700'}
          >
            {isComplete
              ? 'All required information has been filled successfully.' 
              : 'Please complete all fields marked with * (asterisk) to finish registration.'}
          </Typography>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default PlayerDetailForm;