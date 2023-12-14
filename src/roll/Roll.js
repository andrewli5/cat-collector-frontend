import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import CatSilhouette from "../assets/unknown_cat.png";
import Dice from "../assets/dice.png";
import { importAll } from "../utils/importAll";
import { useState } from "react";
import * as client from "../client";
import { storeCurrentUser, getCurrentUser } from "../client";
import {
  BREEDID_TO_CATICON,
  RARITY_TO_TEXT_COLOR,
  RARITY_TO_STRING,
} from "../constants";
import _ from "lodash";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import NotificationSnackbar from "../reusable/NotificationSnackbar";
import Coin from "../assets/coin_icon.png";
import itemGet from "../assets/sounds/item_get_boosted.mp3";
import superItemGet from "../assets/sounds/super_item_get.mp3";
import rollSound from "../assets/sounds/roll.mp3";
import duplicateGet from "../assets/sounds/duplicate_get.mp3";
import Backdrop from "@mui/material/Backdrop";
import RollOdds from "./RollOdds";

const IMAGE_SIZE = "40vh";

export default function Roll({ coins, setCoins, setCoinDiff, music }) {
  const [isRolling, setIsRolling] = useState(false);
  const [rollCost, setRollCost] = useState(
    getCurrentUser() ? getCurrentUser().rollCost : 100
  );
  const [displayedIcon, setDisplayedIcon] = useState(CatSilhouette);
  const [rollResults, setRollResults] = useState({});
  const [displayResults, setDisplayResults] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showOdds, setShowOdds] = useState(false);

  const catIcons = importAll(
    require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/)
  );

  var results = null;

  const handleShowOdds = () => {
    setShowOdds(true);
  };

  const handleHideOdds = () => {
    setShowOdds(false);
  };

  const playAudio = (audioFile, volume, currentTime) => {
    if (music) {
      const audio = new Audio(audioFile);
      audio.currentTime = currentTime || 0;
      audio.volume = volume || 1.0;
      audio.play();
    }
  };

  const handleRoll = async () => {
    // start rolling animation
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
      playAudio(rollSound, 0.6);
      results = await client.rollCatForUser(getCurrentUser()._id);
      const multipliers = await client.getMultipliers();
      const odds = await client.getOdds();
      const userData = await client.getUserDataByUserId(getCurrentUser()._id);

      const luckUpgrades = userData["upgrades"].filter((u) =>
        u.includes("LUCK")
      );
      const highestUpgrade = luckUpgrades.sort().reverse()[0];
      const currentOdds = odds[highestUpgrade];
      const rarity = results.rarity;
      const rarityPercentage = currentOdds[rarity] * 100;
      results = { ...results, odds: rarityPercentage };

      // if user rolls a new cat, show old coins per click -> new coins per click
      if (!results["duplicate"]) {
        const multiplier = multipliers[rarity];
        results = {
          ...results,
          multiplier: multiplier,
          oldCoinsPerClick: getCurrentUser().coinsPerClick,
          newCoinsPerClick: Math.round(
            getCurrentUser().coinsPerClick * multiplier
          ),
        };
      }
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
        if (["E", "L", "M"].includes(results["rarity"])) {
          playAudio(superItemGet, 0.25, 0.4);
        } else {
          playAudio(itemGet, 0.25, 0.4);
        }
      } else {
        playAudio(duplicateGet);
      }
    }, 2000);
  };

  useEffect(() => {
    document.title = "roll | " + APP_NAME;
  }, []);

  const getNewCatUnlockedTitle = () => {
    const imgSize = 25;
    return (
      <>
        <img
          src={client.catGif}
          width={imgSize}
          height={imgSize}
          style={{ marginRight: "5px" }}
        />
        new cat unlocked!
        <img src={client.catGif} width={imgSize} height={imgSize} />
      </>
    );
  };
  function getRollResultsMessage() {
    return (
      <>
        <Typography variant="h4" color={"white"} textAlign="center">
          {rollResults["duplicate"] ? "you rolled:" : getNewCatUnlockedTitle()}
        </Typography>
        <Typography variant="h3" textAlign="center" color="white">
          <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
            {BREEDID_TO_CATICON[rollResults["breed"]]
              .replace(".png", "")
              .replace("_", " ")}
          </Box>
        </Typography>
        <Typography
          variant="h4"
          display="flex"
          justifyContent={"center"}
          color={RARITY_TO_TEXT_COLOR[rollResults["rarity"]]}
        >
          {RARITY_TO_STRING[rollResults["rarity"]].toLowerCase()}
          <Box>
            {" "}
            <StarRateRoundedIcon
              fontSize="large"
              sx={{ color: RARITY_TO_TEXT_COLOR[rollResults["rarity"]] }}
            />
          </Box>
        </Typography>
        {rollResults["duplicate"] ? (
          <Box
            alignItems={"center"}
            display={"flex"}
            justifyContent="center"
            textAlign="center"
          >
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
          <Box alignItems="center" display="flex" textAlign="center">
            coins per click: {rollResults["oldCoinsPerClick"]}
            <img
              style={{ marginLeft: "2px", marginRight: "5px" }}
              src={Coin}
              width={20}
              height={20}
            />
            ⇒ {rollResults["newCoinsPerClick"]}
            <img
              style={{ marginRight: "5px" }}
              src={Coin}
              width={20}
              height={20}
            />
            {"  (+" + ((rollResults["multiplier"] - 1) * 100).toFixed(0) + "%)"}
          </Box>
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
          icon={false}
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
                : RARITY_TO_TEXT_COLOR[rollResults["rarity"]]
            }`,
            borderRadius: "140px",
            transition: "all 0.3s ease",
          }}
        />
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        textAlign="center"
        alignContent="center"
      >
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
            marginRight: "10px",
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
        <Button
          variant="contained"
          onClick={handleShowOdds}
          sx={{
            height: "auto",
            width: "auto",
            padding: 0,
            minWidth: "45px",
            display: "flex",
            alignContent: "right",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {"(?)"}
        </Button>
        <Backdrop
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={showOdds}
          onClick={handleHideOdds}
        >
          <RollOdds />
        </Backdrop>
      </Box>
    </>
  );
}
