import { useEffect, useState } from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import { importAll } from "../utils/importAll";
import { getCurrentUser } from "../client";
import DefaultIcon from "../assets/profileIcons/A1.png";

export default function SelectProfilePhoto({
  setProfilePictureMenu,
  setProfilePicture,
  currentProfilePicture,
}) {
  const [selectedPicture, setSelectedPicture] = useState("");
  const [availableIcons, setAvailableIcons] = useState([]);

  const profileIcons = importAll(
    require.context("../assets/profileIcons", false, /\.(png|jpe?g|svg)$/)
  );

  const handleIconClick = (icon) => {
    setSelectedPicture(availableIcons[icon]);
  };

  const handleSave = async () => {
    setProfilePicture(selectedPicture);
    setProfilePictureMenu(false);
  };

  const handleCancel = () => {
    setSelectedPicture(currentProfilePicture);
    setProfilePictureMenu(false);
  };

  useEffect(() => {
    if (!getCurrentUser()) {
      navigate("/signin");
    } else {
      setAvailableIcons(profileIcons);
      setSelectedPicture(
        getCurrentUser().profilePicture
          ? getCurrentUser().profilePicture
          : DefaultIcon
      );
    }
  }, []);

  return (
    <Box
      sx={{
        paddingLeft: "2vh",
        paddingRight: "2vh",
        backgroundColor: "primary.main",
        border: "3px solid white",
        borderRadius: 2,
      }}
    >
      <Box component="div" justifyContent="center" display="flex">
        <Typography
          variant="h4"
          sx={{
            marginTop: 2,
            fontSize: { xs: "1.8em", sm: "2em" },
            width: "39vh",
          }}
        >
          Select Profile Picture
        </Typography>
      </Box>
      <Grid
        container
        justifyContent={"center"}
        spacing={2}
        sx={{
          overflow: "scroll",
          maxHeight: "50vh",
          maxWidth: "50vh",
          marginTop: 0,
          marginBottom: 1,
        }}
      >
        {Object.keys(availableIcons).map((icon) => (
          <Grid item>
            <Button
              onClick={() => handleIconClick(icon)}
              sx={{
                width: "13vh",
                height: "13vh",
                borderRadius: "10vh",
              }}
            >
              <Box
                component="img"
                src={availableIcons[icon]}
                sx={{
                  border:
                    availableIcons[icon] === selectedPicture
                      ? "2px solid white"
                      : "",
                  borderRadius: "10vh",
                  bgcolor: "secondary.main",
                  width: "13vh",
                  height: "13vh",
                }}
              />
            </Button>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ margin: 1, display: "flex", justifyContent: "left" }}>
        <Button
          onClick={handleSave}
          variant="contained"
          color="secondary"
          sx={{
            outlineWidth: 1,
            marginRight: 1,
            marginTop: "1px",
            height: "25%",
            padding: "0px 16px",
          }}
        >
          Confirm
        </Button>
        <Button
          onClick={handleCancel}
          variant="outlined"
          color="white"
          sx={{
            height: "25%",
            padding: "0px 16px",
          }}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
}
