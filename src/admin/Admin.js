import { Typography } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import { getCurrentUser } from "../client";
import Forbidden from "./Forbidden";

export default function Admin() {
  useEffect(() => {
    document.title = "admin tools | " + APP_NAME;
  }, []);

  if (!getCurrentUser() || getCurrentUser().role !== "ADMIN") {
    return <Forbidden />;
  } else {
    return (
      <Typography variant="h4" color="grey" textAlign="center">
        Admin tools are in development...
      </Typography>
    );
  }
}
