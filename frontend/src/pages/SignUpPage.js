import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { signup } from "../store/auth";
import httpService from "../utils/httpService";

import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import {
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
  const [validationError, setValidationError] = useState("");

  const { email, password, re_password } = formData;

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear validation error when user starts typing

    if (validationError) setValidationError("");
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
      // Navigate to email verification page with email info
      navigate("/email-verification", { state: { email } });
    } catch (error) {
      // Error handling is done in the auth slice
      console.error("Signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueWithGoogle = async () => {
    try {
      const response = await httpService.get(
        "/auth/o/google-oauth2/?redirect_uri=http://localhost:8000/google"
      );
      window.location.replace(response.data.authorization_url);
    } catch (error) {}
  };

  const handleContinueWithFacebook = async () => {
    try {
      const response = await httpService.get(
        "/auth/o/facebook/?redirect_uri=http://localhost:8000/facebook"
      );
      window.location.replace(response.data.authorization_url);
    } catch (error) {}
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
            startIcon={<GoogleIcon />}
            sx={{ borderRadius: "50px" }}
            onClick={handleContinueWithGoogle}
            disabled={isSubmitting}
          >
            Continue with Google
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<FacebookIcon />}
            sx={{ borderRadius: "50px" }}
            onClick={handleContinueWithFacebook}
            disabled={isSubmitting}
          >
            Continue with Facebook
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
