import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6d6d6dff",
    },
    secondary: {
      main: "#e7e7e7ff",
    },
    tartiary: {
      main: "#000000ff",
    },
    verified: {
      main: "#6c9578ff",
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
