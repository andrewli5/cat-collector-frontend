import { Typography } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";

export default function Shop() {
  useEffect(() => {
    document.title = "shop | " + APP_NAME;
  }, []);

  return (
    <Typography variant="h4" color="grey" textAlign="center">
      The shop is in development...
    </Typography>
  );
}
