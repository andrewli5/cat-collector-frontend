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
  },
  typography: {
    button: {
      fontSize: "1rem",
      textTransform: "none",
    },
  },
});
