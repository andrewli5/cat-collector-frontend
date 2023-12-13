import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import CatSilhouette from "../assets/unknown_cat.png";
import Dice from "../assets/dice.png";
import { importAll } from "../utils/importAll";
import { useState } from "react";
import * as client from "../client";
import { storeCurrentUser, getCurrentUser } from "../client";
import { BREEDID_TO_CATICON, RARITY_TO_COLOR } from "../constants";
import _ from "lodash";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import NotificationSnackbar from "../reusable/NotificationSnackbar";
import Coin from "../assets/coin_icon.png";
import itemGet from "../assets/sounds/item_get.mp3";
import superItemGet from "../assets/sounds/super_item_get.mp3";
import rollSound from "../assets/sounds/roll.mp3";
import duplicateGet from "../assets/sounds/duplicate_get.mp3";

const IMAGE_SIZE = "40vh";

export default function Roll({ coins, setCoins, setCoinDiff, sound }) {
  const [isRolling, setIsRolling] = useState(false);
  const [rollCost, setRollCost] = useState(
    getCurrentUser() ? getCurrentUser().rollCost : 100
  );
  const [displayedIcon, setDisplayedIcon] = useState(CatSilhouette);
  const [rollResults, setRollResults] = useState({});
  const [displayResults, setDisplayResults] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const catIcons = importAll(
    require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/)
  );

  var results = null;

  const handleRoll = async () => {
    setIsRolling(true);
    if (!getCurrentUser()) {
      setTimeout(() => {
        setError(true);
        setErrorMessage("please sign in to roll.");
        setIsRolling(false);
      }, 150);
      return;
    }
    try {
      if (sound) {
        const audio = new Audio(rollSound);
        audio.volume = 0.4;
        audio.play();
      }
      results = await client.rollCatForUser(getCurrentUser()._id);
    } catch (error) {
      if (error.response) {
        setTimeout(() => {
          setError(true);
          setErrorMessage(error.response.data.message);
          setIsRolling(false);
        }, 500);
        return;
      }
    }

    setRollResults(results);

    // update locally
    if (!results["duplicate"]) {
      const user = {
        ...getCurrentUser(),
        cats: [...getCurrentUser().cats, results["breed"]],
      };
      storeCurrentUser(user);
    }

    const updateRollCost = (newRollCost) => {
      setRollCost(newRollCost); // display new roll cost
      client.storeCurrentUser({ ...getCurrentUser(), rollCost: newRollCost }); // update user in local storage
    };

    const rolledCatBreedId = results["breed"];
    const rolledCatIcon = BREEDID_TO_CATICON[rolledCatBreedId];
    if (coins - rollCost >= 0) {
      setCoins(coins - rollCost); // display new coin amount
      client.storeCurrentUser({ ...getCurrentUser(), coins: coins - rollCost }); // update user in local storage
    }

    // rolling animation
    const interval = setInterval(() => {
      const iconNames = Object.keys(catIcons);
      const randomIcon =
        iconNames[Math.floor(Math.random() * iconNames.length)];
      setDisplayedIcon(catIcons[randomIcon]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsRolling(false);
      setDisplayedIcon(catIcons[rolledCatIcon]);
      setDisplayResults(true);
      setCoinDiff(results["addedCoins"]);
      setCoins(coins - rollCost + results["addedCoins"], true);
      client.storeCurrentUser({
        ...getCurrentUser(),
        coins: coins - rollCost + results["addedCoins"],
      });
      if (!results["duplicate"]) {
        updateRollCost(results["rollCost"]);
        if (sound) {
          if (["E", "L", "M"].includes(results["rarity"])) {
            const audio = new Audio(superItemGet);
            audio.currentTime = 0.4;
            audio.volume = 0.25;
            audio.play();
          } else {
            const audio = new Audio(itemGet);
            audio.currentTime = 0.4;
            audio.play();
          }
        }
      } else {
        if (sound) {
          new Audio(duplicateGet).play();
        }
      }
    }, 2000);
  };

  useEffect(() => {
    document.title = "roll | " + APP_NAME;
  }, []);

  function getRollResultsMessage() {
    return (
      <>
        <Typography variant="h4" color={"white"} textAlign="center">
          {rollResults["duplicate"] ? "you rolled:" : "new cat unlocked!"}
        </Typography>
        <Typography
          variant="h4"
          textAlign="center"
          color={RARITY_TO_COLOR[rollResults["rarity"]]}
        >
          <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
            {BREEDID_TO_CATICON[rollResults["breed"]]
              .replace(".png", "")
              .replace("_", " ")}
            !{" "}
            <StarRateRoundedIcon
              fontSize="large"
              sx={{ color: RARITY_TO_COLOR[rollResults["rarity"]] }}
            />
          </Box>
        </Typography>
        {rollResults["duplicate"] ? (
          <Box alignItems={"center"} display={"flex"} textAlign="center">
            {"duplicate, received:  "}

            {rollResults["addedCoins"]}
            <img
              style={{ marginLeft: "5px" }}
              src={Coin}
              width={20}
              height={20}
            />
          </Box>
        ) : (
          <></>
        )}
      </>
    );
  }

  return (
    <>
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography variant="h3">roll for cats!</Typography>
      </Box>
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5">
          Discover new cats & receive coins for rolling owned cats
        </Typography>
      </Box>
      <NotificationSnackbar
        open={error}
        setOpen={setError}
        message={errorMessage}
        severity="error"
        autoHideDuration={6000}
      />
      {!_.isEmpty(rollResults) ? (
        <NotificationSnackbar
          open={displayResults}
          setOpen={setDisplayResults}
          message={getRollResultsMessage()}
        />
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
            margin: "40px",
            boxShadow: `0px 0px 90px ${
              isRolling || rollResults["breed"] === undefined
                ? "rgba(128, 128, 128, 1)"
                : RARITY_TO_COLOR[rollResults["rarity"]]
            }`,
            borderRadius: "140px",
            transition: "all 0.3s ease",
          }}
        />
      </Box>
      <Button
        disabled={
          isRolling ||
          !getCurrentUser() ||
          getCurrentUser().coins < getCurrentUser().rollCost
            ? true
            : false
        }
        variant="contained"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "20px",
        }}
        onClick={handleRoll}
      >
        <img
          src={Dice}
          width={30}
          height={30}
          style={{ marginRight: "10px" }}
        />
        {isRolling ? (
          "Rolling..."
        ) : (
          <>
            roll |
            <Typography variant="h5" marginLeft={1}>
              {rollCost.toLocaleString()}
            </Typography>
            <img
              style={{ marginLeft: "5px" }}
              src={Coin}
              width={20}
              height={20}
            />
          </>
        )}
      </Button>
    </>
  );
}
