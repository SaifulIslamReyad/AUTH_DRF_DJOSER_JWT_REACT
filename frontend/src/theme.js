import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e7e7e7ff",
    },
    secondary: {
      main: "#686868ff",
    },
    tartiary: {
      main: "#000000ff",
    },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  components: {
    MuiTypography: {
      variants: [
        {
          props: { variant: "typography2" }, 
          style: {
            fontSize: "2rem",         
            fontWeight: 500,          
            color: "#ffffffff",         
            WebkitTextStroke: "1px black",
            textAlign: "center",
            display: "block",
          },
        },
      ],
    },
  },
});

export default theme;
