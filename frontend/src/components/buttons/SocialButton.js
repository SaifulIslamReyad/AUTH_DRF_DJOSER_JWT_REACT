import { Button, CircularProgress } from "@mui/material";

const SocialButton = ({
  children,
  icon,
  loading = false,
  loadingText = "Connecting...",
  disabled = false,
  onClick,
  provider = "generic", // google, facebook, generic
  type = "button",
  size = "large",
  fullWidth = true,
  ...props
}) => {
  // Define provider-specific colors and styles
  const getProviderStyles = (provider) => {
    switch (provider.toLowerCase()) {
      case "google":
        return {
          backgroundColor: "#4285F4",
          "&:hover": {
            backgroundColor: "#3367D6",
          },
        };
      case "facebook":
        return {
          backgroundColor: "#1877F2",
          "&:hover": {
            backgroundColor: "#166FE5",
          },
        };
      default:
        return {
          backgroundColor: "primary.main",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        };
    }
  };

  return (
    <Button
      type={type}
      variant="contained"
      size={size}
      fullWidth={fullWidth}
      disabled={loading || disabled}
      onClick={onClick}
      startIcon={
        loading ? <CircularProgress size={20} color="inherit" /> : icon
      }
      sx={{
        borderRadius: "50px",
        py: 1.5,
        fontSize: size === "large" ? "1.1rem" : "1rem",
        fontWeight: "medium",
        textTransform: "none",
        color: "white",
        boxShadow: 2,
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-1px)",
        },
        transition: "all 0.2s ease-in-out",
        ...getProviderStyles(provider),
        ...props.sx,
      }}
      {...props}
    >
      {loading ? loadingText : children}
    </Button>
  );
};

export default SocialButton;
