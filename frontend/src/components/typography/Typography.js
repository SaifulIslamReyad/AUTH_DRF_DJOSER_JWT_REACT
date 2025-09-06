import { Typography as MuiTypography } from "@mui/material";

const Typography = ({ children, sx = {}, ...props }) => {
  const defaultStyles = {
    fontFamily: "Poppins, Arial, sans-serif",
    fontWeight: 400,
  };

  return (
    <MuiTypography sx={{ ...defaultStyles, ...sx }} {...props}>
      {children}
    </MuiTypography>
  );
};

export default Typography;
