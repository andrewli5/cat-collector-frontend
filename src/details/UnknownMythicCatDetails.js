import { Box } from "@mui/material";
import NOT_FOUND from "../assets/404_not_found.jpg";
import NotificationSnackbar from "../reusable/NotificationSnackbar";
import { useState } from "react";

export default function UnknownMythicCatDetails() {
  const [open, setOpen] = useState(true);
  return (
    <Box display="flex" justifyContent="center" sx={{ paddingTop: "15px" }}>
      <NotificationSnackbar
        open={true}
        setOpen={setOpen}
        severity="warning"
        message="Where did this cat come from?"
        autoHideDuration={10000}
      >
        <h1>Unknown Mythic Cat</h1>
      </NotificationSnackbar>
      <img src={NOT_FOUND} />
    </Box>
  );
}
