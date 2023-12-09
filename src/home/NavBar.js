import { Toolbar, Button, Typography } from "@mui/material";
import { getCurrentUser } from "../client";
import coinIcon from "../assets/coin_icon.png";
import { useLocation } from "react-router-dom";
import SeachUser from "../search_user/Search";
import Search from "../search/Search";
import SearchUser from "../search_user/Search";

export default function NavBar({ coins }) {
  const path = useLocation().pathname;

  return (
    <Toolbar>
      <Button
        color={path === "/" ? "quintenary" : "white"}
        href="/"
        variant="text"
      >
        home
      </Button>
      <Typography variant="h4" noWrap>
        {"|"}
      </Typography>
      <Button
        color={path.includes("mycats") ? "quintenary" : "white"}
        href="/mycats"
        variant="text"
      >
        my cats
      </Button>
      <Typography variant="h4" noWrap>
        {"|"}
      </Typography>
      <Button
        color={path.includes("roll") ? "quintenary" : "white"}
        href="/roll"
      >
        roll
      </Button>
      <Typography variant="h4" noWrap>
        {"|"}
      </Typography>
      <Button
        color={path.includes("shop") ? "quintenary" : "white"}
        href="/shop"
      >
        shop
      </Button>
      <Typography variant="h4" noWrap>
        {"|"}
      </Typography>
      <Button
        color={path.includes("favorites") ? "quintenary" : "white"}
        href="/favorites"
      >
        favorites
      </Button>
      <Typography variant="h4" noWrap>
        {"|"}
      </Typography>
      <Button
        color={path.includes("myprofile") ? "quintenary" : "white"}
        href="/myprofile"
      >
        my profile
      </Button>
      <SearchUser />
      {getCurrentUser() && getCurrentUser().role === "ADMIN" && (
        <>
          <Typography variant="h4" noWrap>
            {"|"}
          </Typography>
          <Button
            color={path.includes("admin") ? "quintenary" : "red"}
            href="/admin"
          >
            admin tools
          </Button>
        </>
      )}
      <div
        style={{
          marginLeft: "auto",
          flexDirection: "row",
          display: "flex",
        }}
      >
        <Typography variant="h4" noWrap marginRight={1}>
          {coins.toLocaleString()}
        </Typography>
        <img src={coinIcon} style={{ height: 40, width: 40 }} />
      </div>
    </Toolbar>
  );
}
