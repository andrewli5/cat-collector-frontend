import React, { useEffect, useState } from "react";
import {
  Box,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getUserByUsername } from "../client";
import NotificationSnackbar from "../reusable/NotificationSnackbar";
import OtherProfile from "../profile/OtherProfile";
import { APP_NAME } from "../constants";
import { useTheme } from "@emotion/react";

export default function SearchUsers() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "find users | " + APP_NAME;
  }, []);

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
      justifyContent="center"
      alignItems="center"
      display="flex"
      sx={{ minHeight: "50vh" }}
      flexDirection={isMdScreen ? "column" : "row"}
    >
      <NotificationSnackbar
        open={error}
        setOpen={setError}
        severity="error"
        message={errorMessage.toLowerCase()}
        autoHideDuration={3000}
      />
      <Box
        sx={{
          width: 300,
        }}
      >
        <Typography variant="h3" textAlign={"center"}>
          find users
        </Typography>
        <TextField
          size="small"
          label="find user..."
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleSubmit}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="quintenary" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Routes>
        <Route path="/:username" element={<OtherProfile />} />
      </Routes>
    </Box>
  );
}
