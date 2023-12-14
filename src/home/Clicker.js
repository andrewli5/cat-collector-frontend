import { Box, Button, Grow, Typography } from "@mui/material";
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
const BASE_COINS_PER_CLICK = 50;
const BASE_CRIT_RATE = 0.005;

export default function Clicker({
  coins,
  setCoins,
  coinDiff,
  setCoinDiff,
  saving,
  setSaving,
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

  var coinsPerClick = BASE_COINS_PER_CLICK;
  if (getCurrentUser()) {
    coinsPerClick = getCurrentUser().coinsPerClick;
  }
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
      <Box bgcolor="primary.main" sx={{ marginBottom: "10px" }}>
        <Typography variant="h3" color="white" sx={{ width: "100vw" }}>
          {APP_NAME}
        </Typography>
      </Box>
      <img
        src={catGif}
        onClick={playSoundEffect}
        width={"150px"}
        height={"150px"}
        style={{ marginTop: 5 }}
      />
      <Typography
        variant="h4"
        color="gray"
        sx={{ marginTop: 3 }}
        textAlign="center"
      >
        current coin rate:
        <Typography
          variant="h4"
          color="lightgreen"
          fontWeight="bold"
          alignItems={"center"}
          justifyContent={"center"}
          display={"flex"}
        >
          <img
            src={coinGif}
            width={27}
            height={27}
            alt="coin"
            style={{ marginRight: 3 }}
          />
          {coinsPerClick.toLocaleString()} per click
        </Typography>
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCoinClick}
        className="quirkyButton quirkyButtonShadow flash-slide"
        sx={{ marginTop: 1, width: 100, height: 100 }}
        disableRipple
      >
        <img
          style={{ WebkitUserDrag: "none" }}
          src={coinGif}
          width={80}
          height={80}
          alt="coin"
        />
      </Button>
      <Grow in={saving && coinDiff != 0}>
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
    </div>
  );
}
