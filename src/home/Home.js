import { Box, Button, Container, Typography } from "@mui/material";
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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import coinIcon from "../assets/coin_icon.png";
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
import { importAll } from "../utils/importAll";
import { Check, CheckCircle } from "@mui/icons-material";
import UnknownMythicCatDetails from "../details/UnknownMythicCatDetails";

export default function Home() {
  const path = useLocation().pathname;
  const [warning, setWarning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [coins, setCoins] = useState(0); // used to force rerender of NavBar
  const [timeoutId, setTimeoutId] = useState(null); // used to debounce save to cloud
  const [effectCount, setEffectCount] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (effectCount < 2) {
      setEffectCount(effectCount + 1);
      return;
    }
    setSaving(true);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      updateUserCoinsByUserId(getCurrentUser()._id, coins, () => {
        setSaving(false);
      });
    }, 1500);
    setTimeoutId(newTimeoutId);
  }, [coins]);

  var coinsPerClick = 50;
  if (getCurrentUser()) {
    coinsPerClick = getCurrentUser().coinsPerClick;
  }

  const handleCoinClick = () => {
    if (!getCurrentUser()) {
      setWarning(true);
      return;
    } else {
      storeCurrentUser({ ...getCurrentUser(), coins: coins + coinsPerClick });
      setCoins(coins + coinsPerClick);
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
    <Container component="main" maxWidth="lg">
      <TopBar />
      <NavBar coins={coins} />
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
          <Box
            bgcolor="primary.main"
            sx={{ marginTop: "15px", marginBottom: "10px" }}
          >
            <Typography variant="h3" color="white" sx={{ width: "100vw" }}>
              {APP_NAME}
            </Typography>
          </Box>
          <img src={catGif} width={"150px"} height={"150px"} />
          <Typography variant="h4" color="white" sx={{ marginTop: 10 }}>
            current coin rate: {coinsPerClick}
            <img
              src={coinIcon}
              width={20}
              height={20}
              alt="coin"
              style={{ marginBottom: -1.3, marginLeft: 9 }}
            />
            /click
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCoinClick}
            sx={{ marginBottom: 1.3, marginTop: 3, maxWidth: 210 }}
          >
            <img
              src={coinIcon}
              width={25}
              height={25}
              alt="coin"
              style={{ marginRight: 6 }}
            />
            click for coins!
          </Button>
          {saving ? (
            <Typography
              variant="body1"
              color="gray"
              display="flex"
              alignItems="center"
            >
              saving...
            </Typography>
          ) : (
            <Typography
              variant="body1"
              color="gray"
              display="flex"
              alignItems="center"
            >
              <Check fontSize="10px" sx={{marginRight: 1}}/> saved!
            </Typography>
          )}
        </div>
      )}
      <Routes>
        <Route path="/mycats" element={<MyCats />} />
        <Route path="/rarities/:rarity" element={<MyCats rarity={true} />} />
        <Route path="/search" element={<EmptySearch />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/roll" element={<Roll setCoins={setCoins} />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/details/???" element={<UnknownMythicCatDetails />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/find-users/*" element={<SearchUsers />} />
        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
    </Container>
  );
}
