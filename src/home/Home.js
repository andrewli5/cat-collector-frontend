import { Container } from "@mui/material";
import NavBar from "../navbar/NavBar";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = APP_NAME + " | home";
  });

  const mycats = async () => {
    navigate("/mycats");
  };


  return (
    <Container component="main" maxWidth="lg">
      <NavBar />
      <Button color="white" variant="contained" onClick={mycats}>
        My Collection
      </Button>
    </Container>
  );
}
