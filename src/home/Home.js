import { Box } from "@mui/material";
import TopBar from "./TopBar";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MyCats from "../mycats/MyCats";
import Search from "../search/Search";
import EmptySearch from "../search/EmptySearch";
import NavBar from "./NavBar";
import Shop from "../shop/Shop";
import Admin from "../admin/Admin";
import { getCurrentUser } from "../client";
import Details from "../details/Details";
import MyProfile from "../profile/MyProfile";
import Favorites from "../favorites/Favorites";
import NotificationSnackbar from "../reusable/NotificationSnackbar";
import SearchUsers from "../searchUsers/SearchUsers";
import Forbidden from "../admin/Forbidden";
import UnknownMythicCatDetails from "../details/UnknownMythicCatDetails";
import Footer from "./Footer";
import NotFound from "./NotFound";
import Play from "../play/Play";
import Info from "./Info";

export default function Home() {
  const [warning, setWarning] = useState(false);
  const [coins, setCoins] = useState(0); // used to force rerender of NavBar
  const [coinDiff, setCoinDiff] = useState(0); // used to show change in coins
  const [coinsPerClick, setCoinsPerClick] = useState(50);
  const [saving, setSaving] = useState(false);
  const [music, setMusic] = useState(
    localStorage.getItem("music")
      ? localStorage.getItem("music") === "true"
      : true,
  );
  const setCoinHandler = (newCoins, skipCoinDiff) => {
    if (!skipCoinDiff) {
      const diff = newCoins - coins;
      setCoinDiff(coinDiff + diff);
    }
    setCoins(newCoins);
  };

  useEffect(() => {
    if (getCurrentUser()) {
      setCoins(getCurrentUser().coins);
      setCoinsPerClick(getCurrentUser().coinsPerClick);
    }
  }, []);

  return (
    <>
      <NotificationSnackbar
        open={warning}
        setOpen={setWarning}
        severity="warning"
        message="please sign in to do that!"
        autoHideDuration={3000}
      />
      <TopBar />
      <Box display="flex" justifyContent="center" width="100%">
        <NavBar
          coins={coins}
          coinDiff={coinDiff}
          coinDiffVisible={saving}
          music={music}
          setMusic={setMusic}
        />
      </Box>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Info music={music} />} />
        <Route
          path="/play"
          element={
            <Play
              coins={coins}
              coinsPerClick={coinsPerClick}
              setCoinsPerClick={setCoinsPerClick}
              coinDiff={coinDiff}
              setCoinDiff={setCoinDiff}
              setCoins={setCoinHandler}
              saving={saving}
              setSaving={setSaving}
              music={music}
              setWarning={setWarning}
            />
          }
        />
        <Route path="/mycats" element={<MyCats />} />
        <Route path="/view/:username" element={<MyCats view={true} />} />
        <Route path="/rarities/:rarity" element={<MyCats rarity={true} />} />
        <Route path="/search" element={<EmptySearch />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/shop" element={<Shop setCoins={setCoinHandler} />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/details/???" element={<UnknownMythicCatDetails />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/find-users/*" element={<SearchUsers />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
