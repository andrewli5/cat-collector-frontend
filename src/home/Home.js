import {
  Alert,
  Button,
  Container,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import TopBar from "./TopBar";
import { useEffect, useState } from "react";
import { APP_NAME } from "../constants";
import { Route, Routes, useLocation } from "react-router-dom";
import MyCats from "../mycats/MyCats";
import EmptySearch from "../search/EmptySearch";
import Search from "../search/Search";
import NavBar from "./NavBar";
import Roll from "../roll/Roll";
import Shop from "../shop/Shop";
import Favorites from "../favorites/Favorites";
import Admin from "../admin/Admin";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import coinIcon from "../assets/coin_icon.png";
import { getCurrentUser, storeCurrentUser, updateUserCoins } from "../client";
import Details from "../details/Details";
import MyProfile from "../profile/MyProfile";

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
    const response = await updateUserCoins(getCurrentUser().username, coins);
    if (response.acknowledged) {
      setSuccess(true);
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <TopBar />
      <NavBar coins={coins} />
      <Snackbar
        open={warning}
        autoHideDuration={2000}
        onClose={() => setWarning(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setWarning(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          please sign in to do that!
        </Alert>
      </Snackbar>
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          successfully saved to cloud!
        </Alert>
      </Snackbar>
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
        <Route path="/search" element={<EmptySearch />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/roll" element={<Roll />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/myprofile" element={<MyProfile />} />
      </Routes>
    </Container>
  );
}
