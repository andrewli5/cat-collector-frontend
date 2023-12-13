import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./login/SignIn";
import { ThemeProvider } from "@emotion/react";
import { THEME } from "./theme/theme";
import { CssBaseline } from "@mui/material";
import SignUp from "./login/SignUp";
import Home from "./home/Home";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={THEME}>
        <CssBaseline />
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
