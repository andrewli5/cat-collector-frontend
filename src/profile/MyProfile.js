import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Backdrop,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { getCurrentUser, storeCurrentUser } from "../client";
import { APP_NAME, ERRORS } from "../constants";
import * as client from "../client";
import NotificationSnackbar from "../reusable/NotificationSnackbar";
import DefaultIcon from "../assets/profileIcons/A1.png";
import SelectProfilePhoto from "./SelectProfilePhoto";
import { generateErrorMessage } from "../utils/utils";

export default function MyProfile() {
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [profilePictureMenu, setProfilePictureMenu] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleProfilePictureClick = () => {
    setProfilePictureMenu(true);
  };

  const handleSave = async () => {
    const updatedFields = { username, firstName, lastName, profilePicture };

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
        const errorMessage = generateErrorMessage(error.response.data.message);
        setError(true);
        setErrorMessage(errorMessage);
      }
      setLoading(false);
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
      setProfilePicture(
        getCurrentUser().profilePicture
          ? getCurrentUser().profilePicture
          : DefaultIcon
      );
      setLoading(false);
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
      <Box bgcolor="primary.main" sx={{ marginBottom: 5 }}>
        <Typography
          variant="h3"
          color={"white"}
          textAlign="center"
          sx={{ width: "100vw", overflowX: "hidden" }}
        >
          my profile
        </Typography>
      </Box>
      <Box
        alignItems="center"
        textAlign="center"
        marginTop={1}
        marginBottom={2}
      >
        <Box component="div" marginBottom={2}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button
              onClick={handleProfilePictureClick}
              sx={{
                alignItems: "center",
                borderRadius: "160px",
                transition: "all 0.3s ease",
                bgcolor: "secondary.main",
                "&:hover": {
                  bgcolor: "secondary.dark",
                },
              }}
            >
              <Box
                component="img"
                src={profilePicture}
                sx={{
                  width: { xs: 100, sm: 150, md: 180, lg: 200 },
                  height: { xs: 100, sm: 150, md: 180, lg: 200 },
                  borderRadius: "160px",
                }}
              ></Box>
            </Button>
          )}
        </Box>
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
        sx={{ marginTop: 2, marginBottom: 1 }}
      >
        save changes
      </LoadingButton>
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={profilePictureMenu}
      >
        <SelectProfilePhoto
          setProfilePictureMenu={setProfilePictureMenu}
          setProfilePicture={setProfilePicture}
          currentProfilePicture={profilePicture}
        />
      </Backdrop>
    </Box>
  );
}
