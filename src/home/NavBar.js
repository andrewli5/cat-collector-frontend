import { Toolbar, Button, Typography, Grow } from "@mui/material";
import { getCurrentUser } from "../client";
import coinGif from "../assets/coin_spin.gif";
import { useLocation } from "react-router-dom";
import { useSpring, animated } from "react-spring";

const NAV_ITEMS = [
  { name: "roll", path: "/roll" },
  { name: "my cats", path: "/mycats" },
  { name: "shop", path: "/shop" },
  { name: "favorites", path: "/favorites" },
  { name: "my profile", path: "/myprofile" },
  { name: "find users", path: "/find-users" },
  { name: "admin tools", path: "/admin" },
];
export default function NavBar({ coins, coinDiff, coinDiffVisible }) {
  const pathName = useLocation().pathname;

  const { animatedCoins } = useSpring({
    from: { animatedCoins: 0 },
    to: { animatedCoins: coins },
  });
  const formattedAnimatedCoins = animatedCoins.to((val) =>
    Math.round(val).toLocaleString(),
  );

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
          (!getCurrentUser() || getCurrentUser().role !== "ADMIN")
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
          alignItems: "center",
        }}
      >
        <Grow in={coinDiffVisible && coinDiff != 0}>
          <Typography
            variant="h5"
            alignItems="center"
            style={{ marginRight: 12 }}
            color={coinDiff >= 0 ? "lightgreen" : "error"}
          >
            {coinDiff >= 0 ? "+" : "-"}
            {Math.abs(coinDiff).toLocaleString()}
          </Typography>
        </Grow>
        <Typography variant="h4" alignItems="center" style={{ marginRight: 5 }}>
          <animated.span>{formattedAnimatedCoins}</animated.span>
        </Typography>
        <img src={coinGif} style={{ marginLeft: 5, height: 40, width: 40 }} />
      </div>
    </Toolbar>
  );
}
