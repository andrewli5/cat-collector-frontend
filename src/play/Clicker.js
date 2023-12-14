import { Box, Button, Grow, Tooltip, Typography } from "@mui/material";
import { APP_NAME } from "../constants";
import { useEffect, useState } from "react";
import * as meows from "../assets/meows";
import minecraftButton from "../assets/sounds/minecraft_button.mp3";
import critSound from "../assets/sounds/crit_sound.mp3";
import coinGif from "../assets/coin_spin.gif";
import {
  catGif,
  getCurrentUser,
  storeCurrentUser,
  updateUserCoinsByUserId,
} from "../client";

const CRIT_MULTIPLIER = 28.5;
const BASE_CRIT_RATE = 0.005;

export default function Clicker({
  coins,
  coinsPerClick,
  setCoins,
  coinDiff,
  setCoinDiff,
  saving,
  setSaving,
  setWarning,
  music,
}) {
  const [saveTimeoutId, setSaveTimeoutId] = useState(null);
  const [effectCount, setEffectCount] = useState(0);
  const [crit, setCrit] = useState(false);

  const meowFiles = [
    meows.meow,
    meows.meow1,
    meows.meow2,
    meows.meow3,
    meows.meow4,
    meows.meow5,
    meows.meow6,
    meows.meow7,
  ];

  useEffect(() => {
    if (effectCount < 2) {
      setEffectCount(effectCount + 1);
      return;
    }
    setSaving(true);

    if (saveTimeoutId) {
      clearTimeout(saveTimeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      updateUserCoinsByUserId(getCurrentUser()._id, coins, () => {
        setTimeout(() => {
          setCoinDiff(0);
        }, 250);
        setSaving(false);
      });
    }, 500);
    setSaveTimeoutId(newTimeoutId);
  }, [coins]);

  const playSoundEffect = () => {
    if (!music) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * meowFiles.length);
    const audio = new Audio(meowFiles[randomIndex]);
    audio.play();
  };

  var critRate = BASE_CRIT_RATE;
  if (getCurrentUser()) {
    critRate = getCurrentUser().critChance;
  }

  const handleCoinClick = () => {
    if (!getCurrentUser()) {
      setWarning(true);
      return;
    } else {
      const rand = Math.random();
      var newCoins = coins;
      if (rand < critRate) {
        newCoins += Math.floor(coinsPerClick * CRIT_MULTIPLIER);
        if (music) {
          const audio = new Audio(critSound);
          audio.play();
        }
        setCrit(true);
        setTimeout(() => {
          setCrit(false);
        }, 350);
      } else {
        if (music) {
          const audio = new Audio(minecraftButton);
          audio.currentTime = 0.25;
          audio.play();
        }
        newCoins += coinsPerClick;
      }
      storeCurrentUser({ ...getCurrentUser(), coins: newCoins });
      setCoins(newCoins);
    }
  };

  useEffect(() => {
    document.title = "home | " + APP_NAME;
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
      <Typography variant="h3" textAlign="center" marginTop={2}>
        click for coins
      </Typography>
      <Typography variant="h5" color="white">
        get more money
      </Typography>
      <Button
        variant="contained"
        color="tertiary"
        onClick={handleCoinClick}
        className="quirkyButton quirkyButtonShadow flash-slide"
        sx={{
          marginTop: 13,
          width: 250,
          height: 250,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "140px",
        }}
        disableRipple
      >
        <img
          style={{ WebkitUserDrag: "none" }}
          src={coinGif}
          width={150}
          height={150}
          alt="coin"
        />
        <Typography variant="h4" color="white" textAlign="center">
          {coinsPerClick.toLocaleString()}
        </Typography>
      </Button>
      <Grow in={saving && coinDiff >= 0}>
        <Typography
          variant="h4"
          alignItems="center"
          color={coinDiff >= 0 ? "lightgreen" : "error"}
          marginTop={1}
        >
          {coinDiff >= 0 ? "+" : "-"}
          {Math.abs(coinDiff).toLocaleString()}
        </Typography>
      </Grow>
      <Grow in={crit}>
        <Typography
          variant="h4"
          alignItems="center"
          color="error"
          fontWeight="bold"
          style={{ textShadow: "0px 0px 50px red" }}
        >
          CRIT! x28.5
        </Typography>
      </Grow>
      <Tooltip title="click me for a surprise!" placement="right">
        <img
          src={catGif}
          onClick={playSoundEffect}
          width={"100px"}
          height={"100px"}
        />
      </Tooltip>
    </div>
  );
}