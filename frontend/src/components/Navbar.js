import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { checkAuthenticated, loadUser, logout } from "../store/auth";
import { Typography } from "./typography";

import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthenticated());
    if (isAuthenticated) dispatch(loadUser());
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          {/* Left Menu Icon (optional for drawer) */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* App Title */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            fontSize={24}
            fontWeight={"fontWeightBold"}
            sx={{ textDecoration: "none", flexGrow: 1, color: "tartiary.main" }}
          >
            Auth
          </Typography>

          {/* Navigation Links */}
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/profile">
                Profile
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
