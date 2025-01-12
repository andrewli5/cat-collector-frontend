import React, { useEffect, useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getUserByUsername } from "../client";
import { APP_NAME } from "../constants";
import DefaultIcon from "../assets/profileIcons/A1.png";

export default function OtherProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
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
        setProfilePicture(
          user.profilePicture ? user.profilePicture : DefaultIcon,
        );
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
      sx={{
        border: "1px solid white",
        borderRadius: "10px",
        marginTop: 3,
        width: "45vh",
        padding: 2,
      }}
    >
      <Typography variant="h6">uid {username}</Typography>
      <Box
        component="img"
        src={profilePicture}
        sx={{
          borderRadius: "10vh",
          bgcolor: "secondary.main",
          width: "14vh",
          height: "14vh",
          marginTop: 1,
        }}
      />
      <Typography variant="h4" color="grey">
        {firstName}
      </Typography>
      <Button
        onClick={handleViewCats}
        variant="contained"
        color="primary"
        sx={{ marginTop: 1, width: "50%" }}
      >
        view cats
      </Button>
    </Box>
  );
}
