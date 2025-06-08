import React from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box
} from "@mui/material";
import { Group } from "@mui/icons-material";

interface PlayerCardProps {
  name: string;
  team: string;
  style?: string;
  grip?: string;
  rubber?: string;
  avatar?: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  name, 
  team, 
  style, 
  grip, 
  rubber, 
  avatar 
}) => {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        transition: "0.3s",
        background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
        border: "1px solid rgba(0,0,0,0.05)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
        }
      }}
    >
      <CardContent sx={{ p: 3, height: "100%" }}>
        {/* Avatar and Name */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar
            src={avatar}
            sx={{
              width: 56,
              height: 56,
              bgcolor: "primary.main",
              fontWeight: "bold"
            }}
          >
            {name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Group fontSize="small" color="primary" />
              <Typography variant="body2">{team}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Style, Grip, Rubber */}
        {style && (
          <Typography variant="body2" mb={1}>
            <strong>Style:</strong> {style}
          </Typography>
        )}
        {grip && (
          <Typography variant="body2" mb={1}>
            <strong>Grip:</strong> {grip}
          </Typography>
        )}
        {rubber && (
          <Typography variant="body2">
            <strong>Rubber:</strong> {rubber}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
