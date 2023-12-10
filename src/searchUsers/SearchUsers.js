import React, { useState } from "react";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getUserByUsername } from "../client";
import NotificationSnackbar from "../reusable/NotificationSnackbar";
import OtherProfile from "../profile/OtherProfile";


export default function SearchUsers() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e.key !== "Enter") {
      return;
    }
    try {
      const res = await getUserByUsername(username);
      navigate(`/find-users/${username}`);
      setUsername("");
      setTimeout(() => {
        document.activeElement.blur();
      }, 0);
    } catch (error) {
      if (error.response) {
        setError(true);
        setErrorMessage(error.response.data.message);
      }
    }
  };

  return (
    <Box
      textAlign={"center"}
      justifyContent={"center"}
      alignItems={"center"}
      display={"flex"}
      flexDirection={"column"}
    >
      <NotificationSnackbar
        open={error}
        setOpen={setError}
        severity="error"
        message={errorMessage.toLowerCase()}
        autoHideDuration={3000}
      />
      <Typography variant="h3">find users</Typography>
      <Box sx={{ width: "250px" }}>
        <TextField
          size="small"
          label="find user..."
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleSubmit}
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="quintenary" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <div>
        <Routes>
          <Route path="/:username" element={<OtherProfile />} />
        </Routes>
      </div>
    </Box>
  );
}
