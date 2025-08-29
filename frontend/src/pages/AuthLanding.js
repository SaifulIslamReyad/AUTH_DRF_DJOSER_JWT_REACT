// src/components/AuthLanding.js
import {
  Person as PersonIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import theme from "../theme.js"

const AuthLanding = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated but doesn't have a name, redirect to profile setup
    if (isAuthenticated && user && !user.name) {
      navigate("/profile-setup");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: "white",
        }}
      >
        <Stack alignItems="center" spacing={3}>
          {/* Avatar */}
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "rgba(255, 255, 255, 0.2)",
              fontSize: "2rem",
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : <PersonIcon />}
          </Avatar>

          {/* Welcome Message */}
          <Box>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Welcome{user.name ? `, ${user.name}` : ""}!
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                mb: 2,
              }}
            >
              Your profile is complete and your account is active.
            </Typography>
          </Box>

          {/* Status Chip */}
          <Chip
            icon={<VerifiedIcon />}
            label="Account Verified"
            sx={{
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              "& .MuiChip-icon": {
                color: "verified.main",
              },
            }}
          />

          {/* Action Button */}
          <Button
            component={Link}
            to="/profile"
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              px: 4,
              py: 1.5,
              borderRadius: "50px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "tartiary.main",
              fontWeight: "bold",
              fontSize: "1.1rem",
              "&:hover": {
                backgroundColor: "white",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              },
              transition: "all 0.3s ease",
            }}
          >
            View Profile
          </Button>
        </Stack>
      </Paper>

      {/* Quick Actions */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom color="text.secondary">
          Quick Actions
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <Button
            component={Link}
            to="/profile"
            variant="outlined"
            sx={{ borderRadius: "25px" }}
          >
            Edit Profile
          </Button>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            sx={{ borderRadius: "25px" }}
          >
            Dashboard
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AuthLanding;
