import { Typography } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";

export default function Roll() {
  useEffect(() => {
    document.title = "roll | " + APP_NAME;
  }, []);
  
  return (
    <Typography variant="h4" color="grey" textAlign="center">
      Rolls are in development...
    </Typography>
  );
}
