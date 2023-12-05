import { createTheme } from "@mui/material";

export const THEME = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6071d2",
    },
    white: {
      main: "#ffffff",
    },
  },
  typography: {
    button: {
      fontSize: "1rem",
      textTransform: "none",
    },
  },
});
