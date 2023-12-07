import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, storeCurrentUser } from "../client";
import { APP_NAME } from "../constants";
import * as client from "../client";

export default function MyProfile() {
  const [success, setSuccess] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleSave = async () => {
    const updatedFields = { firstName, lastName };
    const updatedUser = { ...user, ...updatedFields };
    try {
      const _ = await client.updateUser(user.username, {
        ...updatedFields,
        from_username: user.username,
      });
      storeCurrentUser(updatedUser);
      setSuccess(true);
      setTimeout(() => {
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
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          successfully saved! reloading...
        </Alert>
      </Snackbar>
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
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ marginTop: 3 }}
      >
        save changes
      </Button>
    </Box>
  );
}
