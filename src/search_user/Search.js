import React, { useState } from "react";
import { Alert, Box, Snackbar } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { getUserByUsername } from "../client";

const SearchUser = () => {
  const [username, setUsername] = useState("");
  const [dne, setDne] = useState(false)
  const [found, setFound] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e.key !== "Enter") { 
      return 
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
      <Snackbar
        open={dne}
        autoHideDuration={3000}
        onClose={() => setDne(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {"user does not exist :("}
        </Alert>
      </Snackbar>
      <Snackbar
        open={found}
        autoHideDuration={3000}
        onClose={() => setFound(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
         {"user found!"}
        </Alert>
      </Snackbar>
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
