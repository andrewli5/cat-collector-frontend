import { Typography } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import { getCurrentUser } from "../client";
import { useNavigate } from "react-router-dom";
import Forbidden from "../forbidden/Forbidden";

export default function Admin() {
  const navigate = useNavigate();
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
