import { Typography } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import { getCurrentUser } from "../client";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "admin tools | " + APP_NAME;

    if (!getCurrentUser() || getCurrentUser().role !== "ADMIN") {
      navigate("/forbidden");
    } else {
    }
  }, []);

  return (
    <Typography variant="h" color="white" textAlign="center">
      admin tools
    </Typography>
  );
}
