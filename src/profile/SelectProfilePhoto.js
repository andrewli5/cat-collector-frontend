import { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { importAll } from "../utils/importAll";
import { getCurrentUser, storeCurrentUser } from "../client";
import { BREEDID_TO_CATICON } from "../constants";
const user = getCurrentUser();

export default function SelectProfilePhoto({ setProfilePictureMenu, icon }) {
  const user = getCurrentUser();
  const [selected, setSelected] = useState(icon);
  const [availableIcons, setAvailableIcons] = useState([]);

  // Available icons are the user's unlocked cats + default icons
  const profileIcons = importAll(
    require.context("../assets/profileIcons", false, /\.(png|jpe?g|svg)$/)
  );
  const catIcons = importAll(
    require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/)
  );
  const mythicCatIcons = importAll(
    require.context("../assets/mythicCatIcons", false, /\.(png|jpe?g|svg)$/)
  );
  const allCatIcons = Object.assign(catIcons, mythicCatIcons);

  const handleIconClick = (icon) => {
    setSelected(icon);
    console.log("Icon: ", icon);
    //const updatedUser = { ...user, icon };
    // storeCurrentUser(updatedUser);
  };

  const handleSave = async () => {
    setProfilePictureMenu(false);
    // TODO: update profile picture
  };

  const handleCancel = () => {
    setProfilePictureMenu(false);
  };

  useEffect(() => {
    if (!getCurrentUser()) {
      navigate("/signin");
    } else {
      var ownedCatIcons = [];
      const cats = getCurrentUser().cats;
      cats.map((cat) => {
        ownedCatIcons.push(allCatIcons[BREEDID_TO_CATICON[cat]]);
      });
      setAvailableIcons(Object.assign(profileIcons, ownedCatIcons));
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
        <Typography variant="h4" sx={{ width: "39vh" }}>
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
          marginTop: "0px",
        }}
      >
        {Object.keys(availableIcons).map((icon) => (
          <Grid item>
            <Button
              onClick={() => handleIconClick(icon)}
              sx={{
                borderRadius: "10vh",
                width: "13vh",
                height: "13vh",
              }}
            >
              <Box
                component="img"
                src={availableIcons[icon]}
                sx={{
                  border: icon === selected ? "1px solid white" : "",
                  borderRadius: "10vh",
                  width: "13vh",
                  height: "13vh",
                }}
              />
            </Button>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ margin: 1, display: "flex", justifyContent: "left" }}>
        <Button onClick={handleSave} variant="outlined" color="white">
          Save
        </Button>
        <Button onClick={handleCancel} variant="contained" color="secondary">
          Close
        </Button>
      </Box>
    </Box>
  );
}
