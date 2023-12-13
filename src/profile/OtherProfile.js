import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, TextField, Button } from "@mui/material";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { getUserByUsername } from "../client";
import { APP_NAME } from "../constants";
import MyCats from "../mycats/MyCats";

export default function OtherProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const { username } = useParams();

  const handleViewCats = () => {
    navigate(`/view/${username}`);
  };

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
    <Box
      justifyContent="center"
      alignItems={"center"}
      textAlign={"center"}
      display="flex"
      flexDirection="column"
      sx={{ marginLeft: "70px", width: "30vw", padding: 2 }}
    >
      <Typography variant="h3">{`${username}'s profile`}</Typography>
      <Typography variant="h5" color="grey">
        {"username" + ": " + username}
      </Typography>
      <Typography variant="h5" color="grey">
        {"first name" + ": " + firstName}
      </Typography>
      <Typography variant="h5" color="grey">
        {"last name" + ": " + lastName}
      </Typography>
      <Button
        onClick={handleViewCats}
        variant="contained"
        color="primary"
        sx={{ marginTop: 2, width: "50%" }}
      >
        view cats
      </Button>
    </Box>
  );
}
