import {
  CalendarToday as CalendarIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadUser, updateProfile } from "../store/auth";
import theme from "../theme.js";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { name } = formData;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // Load user data if not already loaded
    if (!user.id) {
      dispatch(loadUser());
    }

    // Set form data with current user data
    if (user.name) {
      setFormData({ name: user.name });
    }
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ name: user.name || "" });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setUpdateLoading(true);
    setError("");
    setSuccess("");

    try {
      await dispatch(updateProfile({ name: name.trim() }));
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      // Reload user data to get the latest information
      dispatch(loadUser());
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading profile...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: "white",
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "rgba(255, 255, 255, 0.2)",
              fontSize: "2rem",
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : <PersonIcon />}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {user.name || "User Profile"}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {user.email}
            </Typography>
            <Chip
              icon={<VerifiedIcon />}
              label="Verified Account"
              size="small"
              sx={{
                mt: 1,
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            />
          </Box>
          {!isEditing && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                backgroundColor: "primary",
                color: "tartiary",
              }}
            >
              Edit Profile
            </Button>
          )}
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {/* Profile Form */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Profile Information
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={user.email || ""}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                    sx: { color: "tartiary.main" },
                  }}
                  helperText="Email cannot be changed"
                />

                <TextField
                  fullWidth
                  name="name"
                  label="Full Name"
                  value={name}
                  onChange={handleOnChange}
                  disabled={!isEditing || updateLoading}
                  required={isEditing}
                  placeholder="Enter your full name"
                  InputProps={{
                    startAdornment: (
                      <PersonIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                    sx: { color: "tartiary.main" },
                  }}
                />

                {isEditing && (
                  <Stack direction="row" spacing={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={
                        updateLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      disabled={updateLoading || !name.trim()}
                      sx={{ borderRadius: "25px" }}
                    >
                      {updateLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      disabled={updateLoading}
                      sx={{ borderRadius: "25px" }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                )}
              </Stack>  
            </form>
          </Paper>
        </Grid>

        {/* Account Information */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Account Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    User ID
                  </Typography>
                  <Typography variant="body2">{user.id || "N/A"}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Account Status
                  </Typography>
                  <Chip
                    label="Active"
                    size="small"
                    sx={{ mt: 0.5 ,backgroundColor: theme.palette.verified.main, color: "white" }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      {user.date_joined
                        ? new Date(user.date_joined).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
