import { Toolbar, Button, Typography } from "@mui/material";
import { getCurrentUser } from "../client";
import coinIcon from "../assets/coin_icon.png";
import { useLocation } from "react-router-dom";

export default function NavBar() {
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
        roll for cats
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
      {getCurrentUser() ? (
        <div
          style={{ marginLeft: "auto", flexDirection: "row", display: "flex" }}
        >
          <Typography variant="h4" noWrap marginRight={1}>
            {getCurrentUser().coins.toLocaleString()}
          </Typography>
          <img src={coinIcon} style={{ height: 40, width: 40 }} />
        </div>
      ) : null}
    </Toolbar>
  );
}
