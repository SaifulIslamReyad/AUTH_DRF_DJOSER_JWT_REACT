import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";

import { LinkButton, PrimaryButton, SocialButton } from "../components/buttons";
import { Typography, Typography2 } from "../components/typography";
import { login } from "../store/auth";
import httpService from "../utils/httpService";

import { Box, Stack, TextField } from "@mui/material";

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
        margin: { xs: 0, sm: "auto" },
        mt: { xs: 2, sm: 8 },
        p: { xs: 2, sm: 4 },
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography2
        gutterBottom
        fontWeight={"fontWeightMedium"}
        sx={{ textAlign: "center", mb: 4 }}
      >
        Sign Into Your Account
      </Typography2>

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

          <PrimaryButton type="submit">Login</PrimaryButton>

          <SocialButton
            provider="google"
            icon={<GoogleIcon />}
            onClick={handleContinueWithGoogle}
          >
            Continue with Google
          </SocialButton>

          <SocialButton
            provider="facebook"
            icon={<FacebookIcon />}
            onClick={handleContinueWithFacebook}
          >
            Continue with Facebook
          </SocialButton>
        </Stack>
      </form>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Don't have an account?{" "}
        <Link to="/signup">
          {" "}
          <LinkButton to="/auth" sx={{ fontSize: "18px" }}>
            No Account? Sign Up
          </LinkButton>
        </Link>
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Forgot your password?{" "}
        <Link to="/reset-password">
          <LinkButton to="/reset-password" sx={{ fontSize: "16px" }}>
            Forgot your password?
          </LinkButton>
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginPage;
