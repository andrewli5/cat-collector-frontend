import NavBar from "../navbar/NavBar";
import { Container } from "@mui/material";

export default function EmptySearch() {
    return (
        <Container component="main" maxWidth="md">
            <NavBar />
            <h1> no cats found ;-;</h1>
        </Container>
  );
}