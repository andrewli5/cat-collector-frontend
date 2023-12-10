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
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleSave = async () => {
    const updatedFields = { firstName, lastName };
    const updatedUser = { ...user, ...updatedFields };
    try {
      setLoading(true);
      const _ = await client.updateUserByUserId(user._id, {
        ...updatedFields,
      });
      storeCurrentUser(updatedUser);
      setSuccess(true);
      setTimeout(() => {
        setLoading(false);
        window.location.reload();
      }, 1000);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
      } else {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    document.title = "my profile | " + APP_NAME;
    if (!getCurrentUser()) {
      navigate("/signin");
    } else {
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
        autoHideDuration={2000}
      />
      <Typography variant="h3">my profile</Typography>
      <Typography variant="h5" color="grey">
        {"username " + " (" + user.username + ")"}
      </Typography>
      <Grid container columnSpacing={3} sx={{ marginTop: 2 }}>
        <Grid item xs={6}>
          <Box textAlign="right">
            <TextField
              size="small"
              label="first name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box textAlign="left">
            <TextField
              label="last name"
              size="small"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </Box>
        </Grid>
      </Grid>
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
