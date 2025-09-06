// src/components/SignInUp.js
import { Box, Button, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { Typography } from "./typography";

const SignInUp = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        mt={5}
        sx={{
          border: "2px solid",
          borderRadius: 2,
          p: 4,
          display: "inline-block",
          margin: 3,
        }}
      >
        <Typography
          variant="body1"
          gutterBottom
          align="center"
          fontWeight="bold"
          color="tartiary"
        >
          LOGIN or SIGNUP for dashboard & more features
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ fontWeight: "fontWeightBold" }}
          >
            LOGIN
          </Button>

          <Button
            component={RouterLink}
            to="/signup"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ fontWeight: "fontWeightBold" }}
          >
            SIGN-UP
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default SignInUp;
