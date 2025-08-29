import {
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { reset_password_confirm } from "../store/auth";

const ResetPasswordConfirmPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uid, token } = useParams();

  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: "",
  });
  const { new_password, re_new_password } = formData;

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!new_password || !re_new_password) {
      setError("Please fill in all fields");
      return;
    }

    if (new_password !== re_new_password) {
      setError("Passwords do not match");
      return;
    }

    if (new_password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await dispatch(
        reset_password_confirm(uid, token, new_password, re_new_password)
      );
      setRequestSent(true);
      // Navigate to login after 3 seconds
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Password reset successful! Please login with your new password.",
          },
        });
      }, 3000);
    } catch (error) {
      setError("Failed to reset password. The link may be expired or invalid.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  if (requestSent) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <CheckCircleIcon
            sx={{ fontSize: 60, color: "success.main", mb: 2 }}
          />
          <Typography variant="h4" gutterBottom color="success.main">
            Password Reset Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your password has been successfully updated. You can now login with
            your new password.
          </Typography>
          <Alert severity="success" sx={{ mb: 3 }}>
            You will be redirected to the login page shortly.
          </Alert>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{ borderRadius: "25px" }}
          >
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <LockIcon sx={{ fontSize: 50, color: "primary.main", mb: 2 }} />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Set New Password
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your new password below to complete the reset process.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              name="new_password"
              label="New Password"
              value={new_password}
              onChange={handleOnChange}
              required
              disabled={loading}
              placeholder="Enter your new password"
              helperText="Password must be at least 8 characters long"
              InputProps={{
                sx: { borderRadius: 2 },
                endAdornment: (
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <TextField
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              name="re_new_password"
              label="Confirm New Password"
              value={re_new_password}
              onChange={handleOnChange}
              required
              disabled={loading}
              placeholder="Confirm your new password"
              error={new_password !== re_new_password && re_new_password !== ""}
              helperText={
                new_password !== re_new_password && re_new_password !== ""
                  ? "Passwords do not match"
                  : ""
              }
              InputProps={{
                sx: { borderRadius: 2 },
                endAdornment: (
                  <IconButton
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !new_password || !re_new_password}
              startIcon={
                loading ? <CircularProgress size={20} /> : <LockIcon />
              }
              sx={{
                borderRadius: "50px",
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

            <Button
              component={Link}
              to="/login"
              variant="text"
              sx={{
                borderRadius: "25px",
                color: "text.secondary",
              }}
            >
              Back to Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default ResetPasswordConfirmPage;
