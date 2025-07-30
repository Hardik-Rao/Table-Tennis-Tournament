import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { io, Socket } from "socket.io-client";

interface Match {
  id: number;
  team1: { name: string };
  team2: { name: string };
  date: string;
  time: string;
  venue: string;
  sport: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  team1_score: number;
  team2_score: number;
  winner_team: string | null;
}

const STATUS_OPTIONS = ["scheduled", "ongoing", "completed", "cancelled"];

const LiveScoreManager: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [updatingMatchId, setUpdatingMatchId] = useState<number | null>(null);
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null);

  // Fetch ongoing matches on mount
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/matches");
        const data = await res.json();
        if (data.success) {
          // Optionally filter to only ongoing matches here or show all with editing
          setMatches(data.data.matches);
        } else {
          setError("Failed to fetch matches");
        }
      } catch (err) {
        setError("Error fetching matches: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  // Connect to socket.io
  useEffect(() => {
    const newSocket = io("http://localhost:5000"); // your backend URL
    setSocket(newSocket);

    // Listen for live score updates and update the local state for those matches
    newSocket.on("liveScoresUpdate", (updatedMatch: Match | Match[]) => {
      if (Array.isArray(updatedMatch)) {
        setMatches(updatedMatch);
      } else {
        setMatches((prevMatches) => {
          const index = prevMatches.findIndex((m) => m.id === updatedMatch.id);
          if (index !== -1) {
            const copy = [...prevMatches];
            copy[index] = updatedMatch;
            return copy;
          } else {
            return [...prevMatches, updatedMatch];
          }
        });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Handle input changes in the table
  const handleInputChange = (
    matchId: number,
    field: keyof Pick<Match, "team1_score" | "team2_score" | "status" | "winner_team">,
    value: string | number | null
  ) => {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === matchId
          ? {
              ...match,
              [field]: value,
            }
          : match
      )
    );
  };

  // Submit the update to backend
  const handleUpdate = async (match: Match) => {
    setUpdatingMatchId(match.id);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/matches/${match.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: match.status,
          team1_score: match.team1_score,
          team2_score: match.team2_score,
          winner_team: match.winner_team,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSnackbarMsg("Match updated successfully");
      } else {
        setError(data.message || "Failed to update match");
      }
    } catch (err) {
      setError("Error updating match: " + (err as Error).message);
    } finally {
      setUpdatingMatchId(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 10 }}>
      <Typography variant="h4" gutterBottom align="center">
        Live Score Manager
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : matches.length === 0 ? (
        <Alert severity="info">No matches found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Match</TableCell>
                <TableCell>Date &amp; Time</TableCell>
                <TableCell>Venue</TableCell>
                <TableCell>Sport</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Team 1 Score</TableCell>
                <TableCell>Team 2 Score</TableCell>
                <TableCell>Winner</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>{`${match.team1.name} vs ${match.team2.name}`}</TableCell>
                  <TableCell>{`${match.date} ${match.time}`}</TableCell>
                  <TableCell>{match.venue}</TableCell>
                  <TableCell>{match.sport}</TableCell>

                  <TableCell>
                    <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={match.status}
                        onChange={(e) =>
                          handleInputChange(match.id, "status", e.target.value as Match["status"])
                        }
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>

                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={match.team1_score}
                      onChange={(e) =>
                        handleInputChange(match.id, "team1_score", Number(e.target.value))
                      }
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={match.team2_score}
                      onChange={(e) =>
                        handleInputChange(match.id, "team2_score", Number(e.target.value))
                      }
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      size="small"
                      value={match.winner_team || ""}
                      onChange={(e) =>
                        handleInputChange(match.id, "winner_team", e.target.value || null)
                      }
                      placeholder="Winner team"
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={updatingMatchId === match.id}
                      onClick={() => handleUpdate(match)}
                    >
                      {updatingMatchId === match.id ? "Updating..." : "Update"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={4000}
        onClose={() => setSnackbarMsg(null)}
        message={snackbarMsg}
      />
    </Container>
  );
};

export default LiveScoreManager;
