import { Button, Container, Typography } from "@mui/material";
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

export default function Home() {
  const path = useLocation().pathname;
  const [warning, setWarning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [coins, setCoins] = useState(0); // used to force rerender of NavBar
  const coinRate = 1;

  useEffect(() => {
    if (path === "/") {
      document.title = "home | " + APP_NAME;
    }
    if (getCurrentUser()) {
      setCoins(getCurrentUser().coins);
    }
  }, [path]);

  const handleCoinClick = () => {
    if (!getCurrentUser()) {
      setWarning(true);
      return;
    } else {
      storeCurrentUser({ ...getCurrentUser(), coins: coins + coinRate });
      setCoins(coins + 1);
    }
  };

  const handleSaveCoins = async () => {
    if (!getCurrentUser()) {
      setWarning(true);
      return;
    }
    const response = await updateUserCoinsByUserId(getCurrentUser()._id, coins);
    if (response.acknowledged) {
      setSuccess(true);
    }
  };

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
          <Typography variant="h4" color="white" sx={{ marginTop: 10 }}>
            current coin rate: {coinRate}
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
          <Button
            variant="contained"
            color="tertiary"
            onClick={handleSaveCoins}
            sx={{ maxWidth: 300 }}
          >
            <CloudUploadIcon sx={{ marginRight: 1.3 }} />
            save coin balance to cloud
          </Button>
        </div>
      )}
      <Routes>
        <Route path="/mycats" element={<MyCats />} />
        <Route path="/rarities/:rarity" element={<MyCats rarity={true}/>} />
        <Route path="/search" element={<EmptySearch />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/roll" element={<Roll setCoins={setCoins} />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/find-users/*" element={<SearchUsers />} />
        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
    </Container>
  );
}
