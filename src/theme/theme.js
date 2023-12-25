import { createTheme } from "@mui/material";

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

export const THEME = createTheme({
  palette: {
    mode: "dark",
    primary: createColor("#735290"),
    secondary: createColor("#363457"),
    tertiary: createColor("#465C69"),
    quaternary: createColor("#98A886"),
    quintenary: createColor("#C4A69D"),
    white: createColor("#FFFFFF"),
    red: createColor("#FF0000"),
  },
  shadows: Array(25).fill("none"),
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          fontSize: "1.3rem",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: "1.3rem",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "1.3rem",
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 760,
      md: 960,
      lg: 1280,
    },
  },
  typography: {
    fontFamily: "VT323",
    button: {
      fontSize: "1.3rem",
      textTransform: "none",
    },
    super: {
      fontSize: "7.2rem",
      lineHeight: "1",
    },
    h1: {
      fontSize: "5rem",
    },
    h2: {
      fontSize: "4rem",
    },
    h3: {
      fontSize: "3rem",
    },
    h4: {
      fontSize: "2rem",
    },
    h5: {
      fontSize: "1.25rem",
    },
    h6: {
      fontSize: "1rem",
    },
    textField: {
      fontSize: "1.5rem",
    },
  },
});
