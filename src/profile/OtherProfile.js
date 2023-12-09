import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getUserByUsername } from "../client";
import { APP_NAME } from "../constants";

export default function OtherProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const { username } = useParams();

  useEffect(() => {
    document.title = `${username}'s profile | ${APP_NAME}`;
    getUserByUsername(username)
      .then((user) => {
        if (!user) {
          navigate("/404"); 
          return;
        }
        setFirstName(user.firstName);
        setLastName(user.lastName);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [username, navigate]);

  return (
    <Box textAlign="center">
      <Typography variant="h3">{`${username}'s profile`}</Typography>
      <Typography variant="h5" color="grey">
        {"username " + " (" + username + ")"}
      </Typography>
      <Grid container columnSpacing={3} sx={{ marginTop: 2 }}>
        <Grid item xs={6}>
          <Box textAlign="right">
            <TextField size="small" label="first name" value={firstName} />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box textAlign="left">
            <TextField label="last name" size="small" value={lastName} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
