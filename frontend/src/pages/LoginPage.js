import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";

import { login } from "../store/auth";
import httpService from "../utils/httpService";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
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
        margin: "auto",
        mt: 8,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom
        sx={{ textAlign: "center", mb: 4 }}>
        Sign Into Your Account
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
          />
          <TextField
            fullWidth
            type="password"
            name="password"
            label="Password"
            value={password}
            onChange={handleOnChange}
          />

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            sx={{ borderRadius: "50px" }}
          >
            Login
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<GoogleIcon />}
            sx={{ borderRadius: "50px" }}
            onClick={handleContinueWithGoogle}
          >
            Continue with Google
          </Button>

          <Button
            variant="contained"
            color="primary" // Facebook blue
            startIcon={<FacebookIcon />}
            sx={{ borderRadius: "50px" }}
            onClick={handleContinueWithFacebook}
          >
            Continue with Facebook
          </Button>
        </Stack>
      </form>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Forgot your password? <Link to="/reset-password">Reset Password</Link>
      </Typography>
    </Box>
  );
};

export default LoginPage;
