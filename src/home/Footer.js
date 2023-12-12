import React from "react";
import "../css/styles.css";
import { Box, Typography } from "@mui/material";
import { APP_NAME } from "../constants";

export default function Footer() {
  return (
    <footer className="footer">
      <Box bgcolor="primary.main">
        <Typography
          variant="h6"
          color="white"
          textAlign={"right"}
          sx={{ paddingRight: "10px", width: "100vw" }}
        >
          © 2023 {APP_NAME}.
        </Typography>
      </Box>
    </footer>
  );
}
