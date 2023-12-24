import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import CatSilhouette from "../assets/unknown_cat.png";
import Dice from "../assets/dice.png";
import { importAll } from "../utils/importAll";
import { useState } from "react";
import * as client from "../client";
import { storeCurrentUser, getCurrentUser } from "../client";
import { BREEDID_TO_CATICON, RARITY_TO_TEXT_COLOR } from "../constants";
import _ from "lodash";
import NotificationSnackbar from "../reusable/NotificationSnackbar";
import coin from "../assets/coin_icon.png";
import diceSpin from "../assets/dice_spin.gif";
import itemGet from "../assets/sounds/item_get_boosted.mp3";
import superItemGet from "../assets/sounds/super_item_get.mp3";
import rollSound from "../assets/sounds/roll.mp3";
import duplicateGet from "../assets/sounds/duplicate_get.mp3";
import Backdrop from "@mui/material/Backdrop";
import RollOdds from "../roll/RollOdds";
import RollResultsMessage from "./RollResultsMessage";
import { styled } from "@mui/material/styles";

const IMAGE_SIZE = "40vh";

const useStyles = styled((theme) => ({
  button: {
    margin: theme.spacing(1),
    sx: {
      marginTop: "5px",
      margin: "3vh",
      width: { xs: "15vh", sm: "30vh", md: "40vh", lg: "40vh" },
      height: { xs: "15vh", sm: "30vh", md: "40vh", lg: "40vh" },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderRadius: "140px",
      transition: "all 0.3s ease",
    },
    [theme.breakpoints.down("sm")]: {
      minWidth: 32,
      paddingLeft: 8,
      paddingRight: 8,
      "& .MuiButton-startIcon": {
        margin: 0,
      },
    },
  },
  buttonText: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

export default function Roll({
  coins,
  setCoins,
  setCoinDiff,
  setCoinsPerClick,
  music,
}) {
  const [isRolling, setIsRolling] = useState(false);
  const [rollCost, setRollCost] = useState(
    getCurrentUser() ? getCurrentUser().rollCost : 100,
  );
  const [displayedIcon, setDisplayedIcon] = useState(diceSpin);
  const [rollResults, setRollResults] = useState({});
  const [displayResults, setDisplayResults] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showOdds, setShowOdds] = useState(false);

  const classes = useStyles();

  const catIcons = importAll(
    require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/),
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
      const ans = await client.rollCatForUser(getCurrentUser()._id);
      results = ans;
      const userData = await client.getUserDataByUserId(getCurrentUser()._id);

      const luckUpgrades = userData["upgrades"].filter((u) =>
        u.includes("LUCK"),
      );
      const highestUpgrade = luckUpgrades.sort().reverse()[0];
      const currentOdds =
        highestUpgrade !== undefined
          ? client.ODDS[highestUpgrade]
          : client.ODDS["BASE"];
      const rarity = results.rarity;
      const rarityPercentage = currentOdds[rarity] * 100;
      results = { ...results, odds: rarityPercentage };

      // if user rolls a new cat, show old coins per click -> new coins per click
      if (!results["duplicate"]) {
        const multiplier = client.MULTIPLIERS[rarity];
        results = {
          ...results,
          multiplier: multiplier,
          oldCoinsPerClick: getCurrentUser().coinsPerClick,
          newCoinsPerClick: Math.round(
            getCurrentUser().coinsPerClick * multiplier,
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

      if (!results["duplicate"]) {
        updateRollCost(results["rollCost"]);
        setCoinsPerClick(results["newCoinsPerClick"]);
        client.storeCurrentUser({
          ...getCurrentUser(),
          coins: coins - rollCost + results["addedCoins"],
          coinsPerClick: results["newCoinsPerClick"],
        });
        if (["E", "L", "M"].includes(results["rarity"])) {
          playAudio(superItemGet, 0.25, 0.4);
        } else {
          playAudio(itemGet, 0.25, 0.4);
        }
      } else {
        client.storeCurrentUser({
          ...getCurrentUser(),
          coins: coins - rollCost + results["addedCoins"],
        });
        playAudio(duplicateGet);
      }
    }, 2000);
  };

  useEffect(() => {
    document.title = "roll | " + APP_NAME;
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {" "}
      <Box display="flex" flexDirection="column">
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: "1.5rem", sm: "3rem", lg: "4rem" },
            textAlign: "center",
            marginTop: 2,
            maxWidth: "80vw",
            padding: "0 22px",
          }}
        >
          roll for cats
        </Typography>
        <Typography
          variant="h5"
          textAlign="center"
          textOverflow="clip"
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          discover new cats and boost your income
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
          message={<RollResultsMessage rollResults={rollResults} />}
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
          marginTop: "5px",
        }}
      >
        <Button
          className="quirkyButton quirkyButtonShadow flash-slide"
          onClick={handleRoll}
          disabled={
            isRolling ||
            !getCurrentUser() ||
            getCurrentUser().coins < getCurrentUser().rollCost
              ? true
              : false
          }
          sx={{
            marginTop: "5px",
            margin: "3vh",
            width: { xs: "15vh", sm: "30vh", md: "40vh" },
            height: { xs: "15vh", sm: "30vh", md: "40vh" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "140px",
            transition: "all 0.3s ease",
          }}
          disableRipple
        >
          <Box
            component="img"
            alt="cat-display"
            src={displayedIcon}
            sx={{
              width: { xs: "15vh", sm: "30vh", md: "40vh" },
              height: { xs: "15vh", sm: "30vh", md: "40vh" },
              WebkitUserDrag: "none",
              margin: "3vh",
            }}
          />
        </Button>
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
          <Box
            component="img"
            alt="dice"
            src={Dice}
            width={30}
            height={30}
            sx={{
              marginRight: "10px",
              display: { xs: "none", sm: "block" },
            }}
          />
          {isRolling ? (
            <Typography variant="h5">...</Typography>
          ) : (
            <>
              <Typography
                variant="h5"
                marginRight={1}
                className={classes.buttonText}
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                roll |
              </Typography>

              <Typography variant="h5">
                {"-"}
                {rollCost.toLocaleString()}
              </Typography>
              <Box
                component="img"
                alt="coin"
                src={coin}
                sx={{
                  width: 20,
                  height: 20,
                  marginLeft: "5px",
                }}
              ></Box>
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
    </div>
  );
}
