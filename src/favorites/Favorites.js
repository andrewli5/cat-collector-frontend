import { Typography } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";

export default function Favorites() {
    useEffect(() => {
      document.title = "favorites | " + APP_NAME;
    }, []);

  return (
    <Typography variant="h4" color="grey" textAlign="center">
      Favorites are in development...
    </Typography>
  );
}
