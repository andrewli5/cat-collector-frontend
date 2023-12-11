import { Toolbar, Button, Typography } from "@mui/material";
import { getCurrentUser } from "../client";
import coinIcon from "../assets/coin_icon.png";
import { useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { name: "my cats", path: "/mycats" },
  { name: "roll", path: "/roll" },
  { name: "shop", path: "/shop" },
  { name: "favorites", path: "/favorites" },
  { name: "my profile", path: "/myprofile" },
  { name: "find users", path: "/find-users" },
  { name: "admin tools", path: "/admin" },
];
export default function NavBar({ coins }) {
  const pathName = useLocation().pathname;

  return (
    <Toolbar>
      <Button
        color={pathName === "/" ? "quintenary" : "white"}
        href="/"
        variant="text"
      >
        <Typography noWrap variant="h5">
          home
        </Typography>
      </Button>
      {NAV_ITEMS.map(({ name, path }) => {
        if (
          name === "admin tools" &&
          getCurrentUser() &&
          getCurrentUser().role !== "ADMIN"
        ) {
          return null;
        }
        return (
          <>
            <Typography variant="h4" noWrap>
              {"|"}
            </Typography>
            <Button
              color={
                pathName.includes(path.substring(1, path.length))
                  ? "quintenary"
                  : "white"
              }
              href={path}
              variant="text"
            >
              <Typography variant="h5" noWrap>
                {name}
              </Typography>
            </Button>
          </>
        );
      })}

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
