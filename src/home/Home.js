import { Container } from "@mui/material";
import NavBar from "../navbar/NavBar";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import { Button } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import MyCats from "../mycats/MyCats";
import EmptySearch from "../search/EmptySearch";
import Search from "../search/Search";

export default function Home() {
    useEffect(() => {
        document.title = APP_NAME + " | home";
    });

    return (
        <Container component="main" maxWidth="lg">
            <NavBar />
            <Button color="white" href="/mycats">
                my cats
            </Button>
            <div style={{ marginTop: "20px" }}>
                <Routes>
                    <Route path="/mycats" element={<MyCats />} />
                    <Route path="/search" element={<EmptySearch />} />
                    <Route path="/search/:query" element={<Search />} />
                </Routes>
            </div>
        </Container>
    );
}
