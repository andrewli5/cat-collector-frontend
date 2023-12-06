import { Container, Typography } from "@mui/material";
import TopBar from "./TopBar";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import { Route, Routes } from "react-router-dom";
import MyCats from "../mycats/Mycats";
import EmptySearch from "../search/EmptySearch";
import Search from "../search/Search";
import NavBar from "./NavBar";
import Roll from "../roll/Roll";
import Shop from "../shop/Shop";
import Favorites from "../favorites/Favorites";

export default function Home() {
  const path = window.location.pathname;
  useEffect(() => {
    if (path === "/") {
      document.title = "home | " + APP_NAME;
    }
  });

  return (
    <Container component="main" maxWidth="lg">
      <TopBar />
      <NavBar />
      {path === "/" && (
        <Typography variant="h4" color="grey" textAlign="center">
          Homepage is in development...
        </Typography>
      )}
      <Routes>
        <Route path="/mycats" element={<MyCats />} />
        <Route path="/search" element={<EmptySearch />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/roll" element={<Roll />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Container>
  );
}
