import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { signup } from "../store/auth";
import httpService from "../utils/httpService";

import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    re_password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  const { email, password, re_password } = formData;

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear validation error when user starts typing
    if (validationError) setValidationError("");
    // Also clear any auth errors from previous attempts
    if (error) {
      // You might want to dispatch an action to clear the error in the store
      // For now, we'll rely on the local validation error state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !re_password) {
      setValidationError("Please fill in all fields");
      return;
    }

    if (password !== re_password) {
      setValidationError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);
    setValidationError("");

    try {
      await dispatch(signup(email, password, re_password));
      // Only navigate if signup was successful
      navigate("/email-verification", { state: { email } });
    } catch (error) {
      // Extract and display meaningful error message
      let errorMessage = error.message || "Signup failed. Please try again.";

      // Handle specific error cases
      if (
        errorMessage.toLowerCase().includes("already exists") ||
        errorMessage
          .toLowerCase()
          .includes("user with this email already exists") ||
        errorMessage.toLowerCase().includes("email already registered") ||
        errorMessage.toLowerCase().includes("unique")
      ) {
        errorMessage =
          "An account with this email address already exists. Please try logging in instead.";
      }

      setValidationError(errorMessage);
      console.error("Signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueWithGoogle = async () => {
    setIsGoogleLoading(true);
    setValidationError("");

    try {
      const response = await httpService.get(
        "/auth/o/google-oauth2/?redirect_uri=http://localhost:8000/google"
      );

      if (response.data && response.data.authorization_url) {
        window.location.replace(response.data.authorization_url);
      } else {
        throw new Error("No authorization URL received");
      }
    } catch (error) {
      console.error("Google OAuth error:", error);
      setValidationError(
        "Failed to initiate Google authentication. Please try again."
      );
      setIsGoogleLoading(false);
    }
  };

  const handleContinueWithFacebook = async () => {
    setIsFacebookLoading(true);
    setValidationError("");

    try {
      const response = await httpService.get(
        "/auth/o/facebook/?redirect_uri=http://localhost:8000/facebook"
      );

      if (response.data && response.data.authorization_url) {
        window.location.replace(response.data.authorization_url);
      } else {
        throw new Error("No authorization URL received");
      }
    } catch (error) {
      console.error("Facebook OAuth error:", error);
      setValidationError(
        "Failed to initiate Facebook authentication. Please try again."
      );
      setIsFacebookLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: { xs: 0, sm: "auto" },
        mt: { xs: 2, sm: 8 },
        p: { xs: 2, sm: 4 },
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="typography2"
        gutterBottom
        fontWeight={"fontWeightMedium"}
        sx={{ textAlign: "center", mb: 4 }}
      >
        Create Your Account
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Error Display */}
          {(validationError || error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationError || error}
              {/* Show helpful link for duplicate email errors */}
              {(validationError || error)
                ?.toLowerCase()
                .includes("already exists") && (
                <Box sx={{ mt: 1 }}>
                  <Link
                    to="/login"
                    style={{ color: "inherit", textDecoration: "underline" }}
                  >
                    Click here to login instead
                  </Link>
                </Box>
              )}
            </Alert>
          )}

          <TextField
            fullWidth
            type="email"
            name="email"
            label="Email Address"
            value={email}
            onChange={handleOnChange}
            required
            disabled={isSubmitting}
          />
          <TextField
            fullWidth
            type="password"
            name="password"
            label="Password"
            value={password}
            onChange={handleOnChange}
            required
            disabled={isSubmitting}
            helperText={
              password.length > 0 && password.length < 8
                ? "Password must be at least 8 characters long"
                : ""
            }
          />
          <TextField
            fullWidth
            type="password"
            name="re_password"
            label="Confirm Password"
            value={re_password}
            onChange={handleOnChange}
            required
            disabled={isSubmitting}
            error={password !== re_password && re_password !== ""}
            helperText={
              password !== re_password && re_password !== ""
                ? "Passwords do not match"
                : ""
            }
          />

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            sx={{ borderRadius: "50px" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={
              isGoogleLoading ? <CircularProgress size={20} /> : <GoogleIcon />
            }
            sx={{ borderRadius: "50px" }}
            onClick={handleContinueWithGoogle}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading
              ? "Connecting to Google..."
              : "Continue with Google"}
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={
              isFacebookLoading ? (
                <CircularProgress size={20} />
              ) : (
                <FacebookIcon />
              )
            }
            sx={{ borderRadius: "50px" }}
            onClick={handleContinueWithFacebook}
            disabled={isFacebookLoading}
          >
            {isFacebookLoading
              ? "Connecting to Facebook..."
              : "Continue with Facebook"}
          </Button>
        </Stack>
      </form>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link to="/login">
          <Button
            variant="outlined"
            color="tartiary"
            size="small"
            sx={{ fontWeight: "fontWeightRegular" }}
          >
            LOGIN
          </Button>
        </Link>
      </Typography>
    </Box>
  );
};

export default SignUpPage;
