import { Container } from "@mui/material";
import Nav from "../Nav";
import { useEffect } from "react";
import { APP_NAME } from "../constants";

export default function Home() {
  useEffect(() => {
    document.title = APP_NAME + " | home";
  });

  return (
    <Container component="main" maxWidth="md">
      <Nav />
    </Container>
  );
}
