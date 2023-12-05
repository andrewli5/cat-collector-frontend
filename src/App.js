import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./login/SignIn";
import { ThemeProvider } from "@emotion/react";
import { THEME } from "./theme/theme";
import { CssBaseline } from "@mui/material";
import SignUp from "./login/SignUp";
import Home from "./home/Home";
import Mycats from "./mycats/Mycats"
import EmptySearch from "./search/EmptySearch";
import Search from "./search/Search";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={THEME}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mycats" element={<Mycats />} />
          <Route path="/search" element={<EmptySearch />} />
          <Route path="/search/:query" element={<Search />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
