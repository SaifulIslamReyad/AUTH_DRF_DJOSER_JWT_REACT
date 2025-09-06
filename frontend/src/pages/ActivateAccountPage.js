import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { LinkButton, PrimaryButton } from "../components/buttons";
import { verify } from "../store/auth";

const ActivateAccountPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { uid, token } = useParams();

  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerifyAccount = async () => {
    setLoading(true);
    setError("");

    try {
      await dispatch(verify(uid, token));
      setVerified(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Account activated successfully! Please login." },
        });
      }, 3000);
    } catch (error) {
      setError("Activation failed. The link may be expired or invalid.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-verify on component mount
  useEffect(() => {
    if (uid && token) {
      handleVerifyAccount();
    }
  }, [uid, token]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        {loading && (
          <Stack alignItems="center" spacing={3}>
            <CircularProgress size={60} />
            <Typography variant="h5">Activating your account...</Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we verify your account.
            </Typography>
          </Stack>
        )}

        {verified && !loading && (
          <Stack alignItems="center" spacing={3}>
            <CheckCircleIcon sx={{ fontSize: 80, color: "success.main" }} />
            <Typography variant="h4" color="success.main" fontWeight="bold">
              Account Activated!
            </Typography>
            <Typography variant="body1">
              Your account has been successfully activated. You will be
              redirected to the login page shortly.
            </Typography>
            <PrimaryButton onClick={() => navigate("/login")} sx={{ px: 4 }}>
              Go to Login
            </PrimaryButton>
          </Stack>
        )}

        {error && !loading && !verified && (
          <Stack alignItems="center" spacing={3}>
            <ErrorIcon sx={{ fontSize: 80, color: "error.main" }} />
            <Typography variant="h4" color="error.main" fontWeight="bold">
              Activation Failed
            </Typography>
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
            <Stack direction="row" spacing={2}>
              <PrimaryButton onClick={() => navigate("/signup")}>
                Sign Up Again
              </PrimaryButton>
              <LinkButton onClick={() => navigate("/login")}>
                Go to Login
              </LinkButton>
            </Stack>
          </Stack>
        )}

        {!uid || !token ? (
          <Stack alignItems="center" spacing={3}>
            <ErrorIcon sx={{ fontSize: 80, color: "error.main" }} />
            <Typography variant="h4" color="error.main" fontWeight="bold">
              Invalid Link
            </Typography>
            <Typography variant="body1">
              The activation link is invalid or incomplete.
            </Typography>
            <PrimaryButton onClick={() => navigate("/signup")}>
              Sign Up Again
            </PrimaryButton>
          </Stack>
        ) : null}
      </Paper>
    </Box>
  );
};

export default ActivateAccountPage;
