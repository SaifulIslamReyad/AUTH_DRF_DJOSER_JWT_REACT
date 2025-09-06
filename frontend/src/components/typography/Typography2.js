import { Typography as MuiTypography } from "@mui/material";

const Typography2 = ({ children, sx = {}, ...props }) => {
  const defaultStyles = {
    fontSize: "2rem",
    fontWeight: 500,
    color: "#ffffffff",
    WebkitTextStroke: "1px black",
    textAlign: "center",
    display: "block",
    fontFamily: "Poppins, Arial, sans-serif",
    mb: 4,
  };

  return (
    <MuiTypography gutterBottom sx={{ ...defaultStyles, ...sx }} {...props}>
      {children}
    </MuiTypography>
  );
};

export default Typography2;
