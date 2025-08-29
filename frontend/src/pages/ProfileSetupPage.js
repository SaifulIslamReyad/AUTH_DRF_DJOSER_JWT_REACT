import {
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  SkipNext as SkipIcon,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../store/auth";

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { name } = formData;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
    // If user already has a name, redirect to home
    if (user && user.name) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await dispatch(updateProfile({ name: name.trim() }));
      navigate("/");
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  const steps = ["Account Created", "Complete Profile", "Ready to Go"];

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {/* Progress Stepper */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Stepper activeStep={1} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={({ active, completed }) =>
                  completed ? (
                    <CheckCircleIcon color="success" />
                  ) : active ? (
                    <Avatar
                      sx={{ bgcolor: "primary.main", width: 24, height: 24 }}
                    >
                      {index + 1}
                    </Avatar>
                  ) : (
                    <Avatar sx={{ bgcolor: "grey.300", width: 24, height: 24 }}>
                      {index + 1}
                    </Avatar>
                  )
                }
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Main Setup Form */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "primary.main",
              margin: "0 auto",
              mb: 2,
            }}
          >
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Complete Your Profile
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            We're almost done! Please provide your name to personalize your
            experience.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will help us address you properly throughout the application.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              fullWidth
              name="name"
              label="Full Name"
              value={name}
              onChange={handleOnChange}
              required
              placeholder="Enter your full name"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <PersonIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
              helperText="This name will be displayed on your profile"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !name.trim()}
              startIcon={
                loading ? <CircularProgress size={20} /> : <SaveIcon />
              }
              sx={{
                borderRadius: "50px",
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              {loading ? "Saving Profile..." : "Complete Setup"}
            </Button>

            <Button
              variant="text"
              startIcon={<SkipIcon />}
              onClick={handleSkip}
              disabled={loading}
              sx={{
                borderRadius: "25px",
                color: "text.secondary",
              }}
            >
              Skip for now
            </Button>
          </Stack>
        </form>

        {/* Welcome Message */}
        <Box sx={{ mt: 4, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Welcome to the platform! 🎉
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your account has been successfully created. Complete your profile to
            get the full experience, or skip for now and update it later from
            your profile page.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfileSetupPage;
