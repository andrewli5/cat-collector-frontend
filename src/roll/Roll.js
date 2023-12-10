import { Alert, Box, Button, Grid, Snackbar, Typography } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import CatSilhouette from "../assets/cat_face_silhouette.png";
import Dice from "../assets/dice.png";
import { importAll } from "../utils/importAll";
import { useState } from "react";
import * as client from "../client";
import { getCurrentUser } from "../client";
import { BREEDID_TO_CATICON, RARITY_TO_COLOR } from "../constants";
import _ from "lodash";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";

const IMAGE_SIZE = 400;
export default function Roll() {
  const [isRolling, setIsRolling] = useState(false);
  const [displayedIcon, setDisplayedIcon] = useState(CatSilhouette);
  const [rollResults, setRollResults] = useState({});
  const [displayResults, setDisplayResults] = useState(false);

  const catIcons = importAll(
    require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/)
  );

  const handleRoll = async () => {
    setIsRolling(true);
    const results = await client.rollCatForUser(getCurrentUser().username);
    setRollResults(results);
    // {breed: 'toyg', rarity: 'R', duplicate: false, addedCoins: 0}

    const rolledCatBreedId = results["breed"];
    const rolledCatIcon = BREEDID_TO_CATICON[rolledCatBreedId];
    const rolledCatName = rolledCatIcon.replace(".png", "").replace("_", " ");

    // rolling animation
    const interval = setInterval(() => {
      const iconNames = Object.keys(catIcons);
      const randomIcon =
        iconNames[Math.floor(Math.random() * iconNames.length)];
      setDisplayedIcon(catIcons[randomIcon]);
    }, 100);

    setTimeout(() => {
      setIsRolling(false);
      clearInterval(interval);
      setDisplayedIcon(catIcons[rolledCatIcon]);
      setDisplayResults(true);
    }, 2000);

    // Banner to alert the user what they rolled
    console.log("User rolled a " + rolledCatName);
  };

  useEffect(() => {
    document.title = "roll | " + APP_NAME;
  }, []);

  return (
    <>
      {" "}
      {!_.isEmpty(rollResults) ? (
        <Snackbar
          open={displayResults}
          onClose={() => setDisplayResults(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setDisplayResults(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            <Typography variant="h4" color={"white"}>
              You rolled:
            </Typography>
            <Typography
              variant="h4"
              color={RARITY_TO_COLOR[rollResults["rarity"]]}
            >
              {BREEDID_TO_CATICON[rollResults["breed"]]
                .replace(".png", "")
                .replace("_", " ")}
              !{" "}
              <StarRateRoundedIcon
                fontSize="large"
                sx={{ color: RARITY_TO_COLOR[rollResults["rarity"]] }}
              />
            </Typography>
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Box
          component="img"
          alt="cat-display"
          src={displayedIcon}
          sx={{
            height: IMAGE_SIZE,
            width: IMAGE_SIZE,
            outline: "1px solid white",
            borderRadius: "5px",
          }}
        />
      </Box>
      <Button
        variant="contained"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "10px",
        }}
        onClick={handleRoll}
      >
        <img
          src={Dice}
          width={30}
          height={30}
          style={{ marginRight: "10px" }}
        />
        {isRolling ? "Rolling..." : "Roll!"}
      </Button>
    </>
  );
}
