import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { signup } from "../store/auth";
import httpService from "../utils/httpService";

import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [accountCreated, setAccountCreated] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    re_password: "",
  });
  const { email, password, re_password } = formData;

  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === re_password) {
      dispatch(signup(email, password, re_password));
      setAccountCreated(true);
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
    if (accountCreated) navigate("/login");
  }, [isAuthenticated, accountCreated, navigate]);

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
          />
          <TextField
            fullWidth
            type="password"
            name="password"
            label="Password"
            value={password}
            onChange={handleOnChange}
          />
          <TextField
            fullWidth
            type="password"
            name="re_password"
            label="Confirm Password"
            value={re_password}
            onChange={handleOnChange}
          />

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            sx={{ borderRadius: "50px" }}
          >
            Sign Up
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
            color="primary"
            startIcon={<FacebookIcon />}
            sx={{ borderRadius: "50px" }}
            onClick={handleContinueWithFacebook}
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
