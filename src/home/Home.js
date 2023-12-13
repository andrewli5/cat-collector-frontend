import { Box, Button, Container, Grow, Typography } from "@mui/material";
import TopBar from "./TopBar";
import { useEffect, useState } from "react";
import { APP_NAME } from "../constants";
import { Route, Routes, useLocation } from "react-router-dom";
import MyCats from "../mycats/MyCats";
import Search from "../search/Search";
import EmptySearch from "../search/EmptySearch";
import NavBar from "./NavBar";
import Roll from "../roll/Roll";
import Shop from "../shop/Shop";
import Admin from "../admin/Admin";
import coinGif from "../assets/coin_spin.gif";
import {
  catGif,
  getCurrentUser,
  storeCurrentUser,
  updateUserCoinsByUserId,
} from "../client";
import Details from "../details/Details";
import MyProfile from "../profile/MyProfile";
import Favorites from "../favorites/Favorites";
import NotificationSnackbar from "../reusable/NotificationSnackbar";
import SearchUsers from "../searchUsers/SearchUsers";
import Forbidden from "../admin/Forbidden";
import UnknownMythicCatDetails from "../details/UnknownMythicCatDetails";
import Footer from "./Footer";
import * as meows from "../assets/meows";
import minecraftButton from "../assets/sounds/minecraft_button.mp3";
import critSound from "../assets/sounds/crit_sound.mp3";

const CRIT_MULTIPLIER = 28.5;
const BASE_COINS_PER_CLICK = 50;
const BASE_CRIT_RATE = 0.005;

export default function Home() {
  const path = useLocation().pathname;
  const [warning, setWarning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [coins, setCoins] = useState(0); // used to force rerender of NavBar
  const [coinDiff, setCoinDiff] = useState(0); // used to show change in coins
  const [saveTimeoutId, setSaveTimeoutId] = useState(null); // used to debounce save to cloud
  const [effectCount, setEffectCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [music, setMusic] = useState(true);
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

  const setCoinHandler = (newCoins, skipCoinDiff) => {
    if (!skipCoinDiff) {
      const diff = newCoins - coins;
      setCoinDiff(coinDiff + diff);
    }
    setCoins(newCoins);
  };

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
      setCoinHandler(newCoins);
    }
  };

  useEffect(() => {
    if (path === "/") {
      document.title = "home | " + APP_NAME;
    }
    if (getCurrentUser()) {
      setCoins(getCurrentUser().coins);
    }
  }, []);

  return (
    <Container
      component="main"
      style={{ paddingLeft: 0, paddingRight: 0 }}
      sx={{ minWidth: "100vw" }}
    >
      <TopBar music={music} setMusic={setMusic} />
      <NavBar coins={coins} coinDiff={coinDiff} coinDiffVisible={saving} />
      <NotificationSnackbar
        open={warning}
        setOpen={setWarning}
        severity="warning"
        message="please sign in to do that!"
        autoHideDuration={3000}
      />
      <NotificationSnackbar
        open={success}
        setOpen={setSuccess}
        severity="success"
        message="successfully saved to cloud!"
        autoHideDuration={3000}
      />
      {path === "/" && (
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
              style={{ "-webkit-user-drag": "none" }}
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
      )}
      <Routes>
        <Route path="/mycats" element={<MyCats />} />
        <Route path="/view/:username" element={<MyCats view={true} />} />
        <Route path="/rarities/:rarity" element={<MyCats rarity={true} />} />
        <Route path="/search" element={<EmptySearch />} />
        <Route path="/search/:query" element={<Search />} />
        <Route
          path="/roll"
          element={
            <Roll
              coins={coins}
              setCoinDiff={setCoinDiff}
              setCoins={setCoinHandler}
              sound={music}
            />
          }
        />
        <Route path="/shop" element={<Shop setCoins={setCoinHandler} />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/details/???" element={<UnknownMythicCatDetails />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/find-users/*" element={<SearchUsers />} />
        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
      <Footer />
    </Container>
  );
}
