import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Alert,
  Box,
  Paper,
  Badge,
  Divider,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

interface LeaderboardEntry {
  team_name: string;
  wins: number;
}

const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"]; // gold, silver, bronze

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/leaderboard");
        const data = await res.json();
        if (data.success) {
          setLeaderboard(data.data);
        } else {
          setError("Failed to load leaderboard");
        }
      } catch (err) {
        setError("Failed to fetch leaderboard: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
        Leaderboard
      </Typography>
      {leaderboard.length === 0 ? (
        <Typography variant="body1" align="center" color="text.secondary">
          No completed matches yet.
        </Typography>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 3 }}>
          <List>
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;
              return (
                <React.Fragment key={entry.team_name}>
                  <ListItem sx={{ px: 3, py: 2 }}>
                    <ListItemAvatar>
                      <Badge
                        color="primary"
                        badgeContent={rank}
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        sx={{
                          "& .MuiBadge-badge": {
                            backgroundColor: isTopThree
                              ? rankColors[rank - 1]
                              : "grey",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.875rem",
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                          },
                        }}
                      >
                        <Avatar sx={{ bgcolor: "#1976d2" }}>
                          <EmojiEventsIcon />
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="h6"
                          fontWeight={isTopThree ? "bold" : "normal"}
                          color={isTopThree ? "primary.main" : "text.primary"}
                        >
                          {entry.team_name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Wins: {entry.wins}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < leaderboard.length - 1 && (
                    <Divider component="li" variant="inset" />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default Leaderboard;
