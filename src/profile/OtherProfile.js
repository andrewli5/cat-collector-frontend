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
          navigate("/profile/dne");
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
      <Typography variant="h5" color="grey">
        {"first name " + " (" + firstName + ")"}
      </Typography>
      <Typography variant="h5" color="grey">
        {"last name " + " (" + lastName + ")"}
      </Typography>
    </Box>
  );
}
