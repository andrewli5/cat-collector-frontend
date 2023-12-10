import { Typography, Button } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";

export default function Forbidden() {
  useEffect(() => {
    document.title = "forbidden | " + APP_NAME;
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <Typography
        variant="h4"
        color="grey"
        textAlign="center"
        sx={{ marginBottom: 2 }}
      >
        access forbidden
      </Typography>
      <Button variant="contained" color="secondary" href="/">
        {"back to home"}
      </Button>
    </div>
  );
}
