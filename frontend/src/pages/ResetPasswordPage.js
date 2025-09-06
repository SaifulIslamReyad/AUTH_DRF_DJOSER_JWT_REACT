import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { LinkButton, PrimaryButton } from "../components/buttons";
import { reset_password } from "../store/auth";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
  });
  const { email } = formData;

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await dispatch(reset_password(email));
      setRequestSent(true);
      // Navigate after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <EmailIcon sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
          <Typography variant="h4" gutterBottom color="success.main">
            Email Sent!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We've sent a password reset link to <strong>{email}</strong>
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Please check your inbox and spam folder. You will be redirected to
            the login page shortly.
          </Alert>
          <LinkButton to="/login">Back to Login</LinkButton>
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
          <EmailIcon sx={{ fontSize: 50, color: "primary.main", mb: 2 }} />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Reset Password
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your email address and we'll send you a link to reset your
            password.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              fullWidth
              type="email"
              name="email"
              label="Email Address"
              value={email}
              onChange={handleOnChange}
              required
              disabled={loading}
              placeholder="Enter your email address"
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />

            <PrimaryButton
              type="submit"
              disabled={loading || !email.trim()}
              startIcon={
                loading ? <CircularProgress size={20} /> : <SendIcon />
              }
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </PrimaryButton>

            <LinkButton
              to="/login"
              startIcon={<ArrowBackIcon />}
              sx={{
                color: "text.secondary",
              }}
            >
              Back to Login
            </LinkButton>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
