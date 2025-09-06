import { Button, CircularProgress } from "@mui/material";

const PrimaryButton = ({
  children,
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  onClick,
  type = "button",
  size = "large",
  color = "secondary",
  fullWidth = true,
  ...props
}) => {
  return (
    <Button
      type={type}
      variant="contained"
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={loading || disabled}
      onClick={onClick}
      sx={{
        borderRadius: "50px",
        py: 1.5,
        fontSize: size === "large" ? "1.1rem" : "1rem",
        fontWeight: "medium",
        textTransform: "none",
        boxShadow: 2,
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-1px)",
        },
        transition: "all 0.2s ease-in-out",
        ...props.sx,
      }}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default PrimaryButton;
