import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e7e7e7ff",
    },

    secondary: {
      main: "#858585ff",
    },
  },
  typography: {
    h6: {
      fontWeight: 750,
      color: "#000000ff",
    },
  },
});

export default theme;
