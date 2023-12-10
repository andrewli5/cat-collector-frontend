import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { getCurrentUser, storeCurrentUser } from "../client";
import { APP_NAME } from "../constants";
import * as client from "../client";
import NotificationSnackbar from "../reusable/NotificationSnackbar";

export default function MyProfile() {
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleSave = async () => {
    const updatedFields = { username, firstName, lastName };
    const updatedUser = { ...user, ...updatedFields };
    try {
      setLoading(true);
      const _ = await client.updateUserByUserId(user._id, {
        ...updatedFields,
      });
      storeCurrentUser(updatedUser);
      setError(false);
      setSuccess(true);
      setTimeout(() => {
        setLoading(false);
        window.location.reload();
      }, 500);
    } catch (error) {
      if (error.response) {
        setError(true);
        setErrorMessage(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    document.title = "my profile | " + APP_NAME;
    if (!getCurrentUser()) {
      navigate("/signin");
    } else {
      setUsername(getCurrentUser().username);
      setFirstName(getCurrentUser().firstName);
      setLastName(getCurrentUser().lastName);
    }
  }, []);

  if (!user) {
    return null;
  }

  return (
    <Box textAlign="center">
      <NotificationSnackbar
        open={success}
        setOpen={setSuccess}
        severity="success"
        message="successfully saved! reloading..."
        autoHideDuration={3000}
      />
      <NotificationSnackbar
        open={error}
        setOpen={setError}
        severity="error"
        message={errorMessage.toLowerCase()}
        autoHideDuration={3000}
      />
      <Typography variant="h3">my profile</Typography>
      <Box
        alignItems="center"
        textAlign="center"
        marginTop={1}
        marginBottom={2}
      >
        <TextField
          size="small"
          label="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </Box>
      <Box alignItems="center" textAlign="center" marginBottom={2}>
        <TextField
          size="small"
          label="first name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
      </Box>
      <Box alignItems="center">
        <TextField
          label="last name"
          size="small"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
      </Box>
      <LoadingButton
        loading={loading}
        type="submit"
        color="primary"
        variant="contained"
        onClick={handleSave}
        sx={{ marginTop: 3 }}
      >
        save changes
      </LoadingButton>
    </Box>
  );
}
