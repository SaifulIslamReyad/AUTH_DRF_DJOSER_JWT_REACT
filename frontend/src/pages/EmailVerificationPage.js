import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { Box, Paper, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { LinkButton, PrimaryButton } from "../components/buttons";
import { Typography } from "../components/typography";

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state if passed from signup
  const email = location.state?.email || "your email";

  const handleOpenGmail = () => {
    // Open Gmail in a new tab
    window.open("https://mail.google.com", "_blank");
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleBackToSignup = () => {
    navigate("/signup");
  };

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
        {/* Success Icon */}
        <Box sx={{ mb: 3 }}>
          <CheckCircleIcon
            sx={{
              fontSize: 80,
              color: "success.main",
              mb: 2,
            }}
          />
        </Box>

        {/* Main Heading */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 2,
          }}
        >
          Check Your Email
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            color: "tartiary.main",
            mb: 3,
          }}
        >
          Account Verification Required
        </Typography>

        {/* Main Message */}
        <Typography
          variant="body2"
          sx={{
            mb: 4,
            color: "text.secondary",
            fontStyle: "italic",
          }}
        >
          Please check your inbox and spam folder. Click the verification link
          in the email to activate your account.
        </Typography>

        {/* Email Display */}
        <Box
          sx={{
            backgroundColor: "grey.100",
            borderRadius: 2,
            p: 2,
            mb: 3,
            border: "1px solid",
            borderColor: "grey.300",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: "medium",
              color: "tartiary.main",
            }}
          >
            {email}
          </Typography>
        </Box>

        {/* Instructions */}

        {/* Action Buttons */}
        <Stack spacing={2}>
          {/* Gmail Button */}
          <PrimaryButton
            startIcon={<EmailIcon />}
            onClick={handleOpenGmail}
            sx={{
              backgroundColor: "#EA4335",
              color: "white",
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "medium",
              "&:hover": {
                backgroundColor: "#d33b2c",
              },
            }}
          >
            Open Gmail
          </PrimaryButton>

          {/* Secondary Actions */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <LinkButton
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToLogin}
              sx={{
                px: 3,
              }}
            >
              Back to Login
            </LinkButton>

            <LinkButton
              onClick={handleBackToSignup}
              sx={{
                px: 3,
              }}
            >
              Try Again
            </LinkButton>
          </Stack>
        </Stack>

        {/* Help Text */}
        <Box
          sx={{ mt: 4, pt: 3, borderTop: "1px solid", borderColor: "grey.200" }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: "block",
              mb: 1,
            }}
          >
            Didn't receive the email?
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
            }}
          >
            Check your spam folder or contact support if you continue having
            issues.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmailVerificationPage;
