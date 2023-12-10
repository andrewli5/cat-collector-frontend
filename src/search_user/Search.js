import React, { useState } from "react";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { getUserByUsername } from "../client";
import NotificationSnackbar from "../reusable/NotificationSnackbar";

const SearchUser = () => {
  const [username, setUsername] = useState("");
  const [dne, setDne] = useState(false);
  const [found, setFound] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e.key !== "Enter") {
      return;
    }
    const userExists = await getUserByUsername(username);
    if (!userExists) {
      setDne(true);
    } else {
      setFound(true);
      navigate(`/profile/${username}`);
      setUsername("");
      setTimeout(() => {
        document.activeElement.blur();
      }, 0);
    }
  };

  return (
    <Box sx={{ width: 300 }}>
      <NotificationSnackbar
        open={dne}
        setOpen={setDne}
        severity="error"
        message="user does not exist :("
        autoHideDuration={3000}
      />
      <NotificationSnackbar
        open={found}
        setOpen={setFound}
        severity="error"
        message="user does not exist :("
        autoHideDuration={3000}
      />
      <TextField
        sx={{
          border: "0",
        }}
        size="small"
        label="find user..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleSubmit}
        margin="dense"
      />
    </Box>
  );
};
export default SearchUser;
